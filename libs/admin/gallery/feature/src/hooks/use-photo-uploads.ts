import { useUploadMediaFileMutation } from '@admin/media/data-access';
import { uploadIssue } from '@admin/media/model';
import { useState } from 'react';

/**
 * Uploads pictures from the computer into the media library one by one and gives back their IDs, so the picker
 * can select them; a file the backend would reject is skipped with its reason.
 */
export function usePhotoUploads() {
  const [uploadFile] = useUploadMediaFileMutation();
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [issues, setIssues] = useState<string[]>([]);

  const upload = async (files: readonly File[], folderId: number | null): Promise<number[]> => {
    const problems = files.flatMap((file) => uploadIssue(file) ?? []);
    const valid = files.filter((file) => uploadIssue(file) === null);
    setIssues(problems);
    const ids: number[] = [];
    if (valid.length === 0) return ids;
    setProgress({ done: 0, total: valid.length });
    for (const file of valid) {
      try {
        ids.push((await uploadFile({ file, folderId }).unwrap()).id);
      } catch {
        problems.push(`«${file.name}»: не вдалося завантажити.`);
        setIssues([...problems]);
      }
      setProgress((current) => current && { ...current, done: current.done + 1 });
    }
    setProgress(null);
    return ids;
  };

  return { upload, progress, issues, clearIssues: () => setIssues([]) };
}
