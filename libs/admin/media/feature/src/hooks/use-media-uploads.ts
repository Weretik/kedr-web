import { useUploadMediaFileMutation } from '@admin/media/data-access';
import { uploadIssue } from '@admin/media/model';
import { useState } from 'react';

import { mediaErrorMessage } from '../errors/media-error-message';

export interface UploadProgress {
  done: number;
  total: number;
}

/**
 * Uploads pictures one by one so a slow connection still shows progress;
 * a file the backend would reject is skipped with its reason before any request.
 */
export function useMediaUploads(onUploaded: (count: number) => void) {
  const [uploadFile] = useUploadMediaFileMutation();
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [issues, setIssues] = useState<string[]>([]);

  const upload = async (files: readonly File[], folderId: number | null) => {
    const problems = files.flatMap((file) => uploadIssue(file) ?? []);
    const valid = files.filter((file) => uploadIssue(file) === null);
    setIssues(problems);
    if (valid.length === 0) return;
    let uploaded = 0;
    setProgress({ done: 0, total: valid.length });
    for (const file of valid) {
      try {
        await uploadFile({ file, folderId }).unwrap();
        uploaded += 1;
      } catch (error) {
        problems.push(`«${file.name}»: ${mediaErrorMessage(error, 'upload')}`);
        setIssues([...problems]);
      }
      setProgress((current) => current && { ...current, done: current.done + 1 });
    }
    setProgress(null);
    if (uploaded > 0) onUploaded(uploaded);
  };

  return { upload, progress, issues, clearIssues: () => setIssues([]) };
}
