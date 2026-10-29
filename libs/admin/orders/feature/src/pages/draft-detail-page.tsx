import {
  useDeleteWorkspaceDraftMutation,
  useGetWorkspaceDraftQuery,
} from '@admin/orders/data-access';
import { OrderDocumentView } from '@admin/orders/ui';
import { NoticeSnackbar, PageLoader } from '@admin/shared/ui';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { Alert, Button, Stack } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { DetailHeader, safeReturnTo } from '../components/detail-header';
import { DraftDeleteDialog } from '../dialogs/draft-delete-dialog';
import { DraftReuseDialog } from '../dialogs/draft-reuse-dialog';
import { useRouteNotice } from '../hooks/use-route-notice';
import { mergeDraftIntoCurrentOrder, useCurrentOrderSet } from '../state/current-order-set';

export function DraftDetailPage() {
  const { notice, close: closeNotice } = useRouteNotice();
  const id = Number(useParams<{ draftId: string }>().draftId);
  const valid = Number.isSafeInteger(id) && id > 0;
  const query = useGetWorkspaceDraftQuery(id, { skip: !valid });
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [deleteDraft, deletion] = useDeleteWorkspaceDraftMutation();
  const [confirm, setConfirm] = useState<'delete' | 'reuse' | null>(null);
  const [error, setError] = useState('');
  const [reuseChoice, setReuseChoice] = useState<'draft' | 'choose' | null>(null);
  const current = useCurrentOrderSet();
  const draft = query.data;
  const detailPath = `/orders/drafts/${id}${params.toString() ? `?${params}` : ''}`;
  const remove = async () => {
    if (!draft) return;
    try {
      await deleteDraft({ draftId: id, version: draft.version }).unwrap();
      navigate(safeReturnTo(params.get('from')));
    } catch (cause) {
      setError(
        (cause as { status?: number }).status === 409
          ? 'Чернетку змінено. Оновіть дані перед видаленням.'
          : 'Не вдалося видалити чернетку.',
      );
      setConfirm(null);
    }
  };
  const reuse = () => {
    if (!draft) return;
    const merged = mergeDraftIntoCurrentOrder(
      draft.lines.map(({ productId, quantity, priceAdjustment }) => ({
        productId,
        quantity,
        priceAdjustment,
      })),
    );
    if (!merged) {
      setError(
        'Набір перевищує ліміт товарів або кількості. Зменште його перед додаванням чернетки.',
      );
      setConfirm(null);
      return;
    }
    const selectedCustomer =
      current.lines.length > 0 && reuseChoice === 'choose' ? '' : draft.counterpartyId;
    navigate(
      `/orders/new?${selectedCustomer ? `customerId=${encodeURIComponent(selectedCustomer)}&` : ''}fromDraft=${draft.draftId}`,
    );
  };
  return (
    <Stack component="section" spacing={3}>
      <NoticeSnackbar message={notice} onClose={closeNotice} />
      <DetailHeader title="Деталі чернетки">
        {draft && (
          <>
            <Button
              onClick={() =>
                navigate(`/orders/drafts/${id}/edit?from=${encodeURIComponent(detailPath)}`)
              }
              startIcon={<EditOutlinedIcon />}
              variant="outlined"
            >
              Редагувати
            </Button>
            <Button
              onClick={() => setConfirm('reuse')}
              startIcon={<ShoppingCartCheckoutIcon />}
              variant="contained"
              sx={{ color: 'common.white' }}
            >
              Оформити на основі
            </Button>
            <Button
              color="error"
              onClick={() => setConfirm('delete')}
              startIcon={<DeleteOutlineIcon />}
              variant="outlined"
            >
              Видалити
            </Button>
          </>
        )}
      </DetailHeader>
      {error && <Alert severity="error">{error}</Alert>}
      {!valid || (query.error as { status?: number } | undefined)?.status === 404 ? (
        <Alert severity="info">Чернетку не знайдено.</Alert>
      ) : query.isLoading ? (
        <PageLoader label="Завантаження чернетки" />
      ) : query.isError ? (
        <Alert
          action={<Button onClick={() => void query.refetch()}>Повторити</Button>}
          severity="error"
        >
          Не вдалося завантажити чернетку.
        </Alert>
      ) : draft ? (
        <OrderDocumentView
          customerName={draft.counterpartyName}
          counterpartyId={draft.counterpartyId}
          reference={draft.title}
          date={draft.updatedAtUtc}
          note={draft.note}
          lines={draft.lines}
          totalAmount={draft.totalAmount}
          pricingUnavailable={draft.pricingStatus === 'Unavailable'}
        />
      ) : null}
      <DraftDeleteDialog
        draft={confirm === 'delete' ? (draft ?? null) : null}
        error=""
        deleting={deletion.isLoading}
        onClose={() => setConfirm(null)}
        onDelete={() => void remove()}
      />
      <DraftReuseDialog
        open={confirm === 'reuse'}
        customerName={draft?.counterpartyName ?? ''}
        hasCurrentLines={current.lines.length > 0}
        choice={reuseChoice}
        onChoiceChange={setReuseChoice}
        onClose={() => {
          setConfirm(null);
          setReuseChoice(null);
        }}
        onConfirm={reuse}
      />
    </Stack>
  );
}
export default DraftDetailPage;
