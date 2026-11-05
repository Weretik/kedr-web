import {
  useCreateProductGroupMutation,
  useFindProductGroupsQuery,
  useGetProductGroupOfProductQuery,
  useSetProductGroupMainMutation,
  useSetProductGroupOfProductMutation,
} from '@admin/products/data-access';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';

import { productAttributesErrorMessage } from '../model/product-attributes-errors';

import type { ProductGroupChange } from '@admin/products/model';

type GroupDialog = 'move' | 'create' | null;

/** «Група» of one product: its variants, moves, a new group, and the main product. */
export function useProductGroupEditor(productId: number, categoryId: number | null) {
  const query = useGetProductGroupOfProductQuery(productId);
  const [dialog, setDialog] = useState<GroupDialog>(null);
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [setGroup, setGroupState] = useSetProductGroupOfProductMutation();
  const [create, createState] = useCreateProductGroupMutation();
  const [setMain, setMainState] = useSetProductGroupMainMutation();

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const groups = useFindProductGroupsQuery(
    dialog === 'move' && categoryId !== null ? { categoryId, search: debounced } : skipToken,
  );
  const currentGroupId = query.data?.group?.id;

  const change = async (next: ProductGroupChange, inDialog: boolean) => {
    (inDialog ? setDialogError : setError)(null);
    try {
      await setGroup({ productId, change: next }).unwrap();
      setDialog(null);
    } catch (cause) {
      (inDialog ? setDialogError : setError)(productAttributesErrorMessage(cause));
    }
  };

  return {
    membership: query.data,
    loading: query.isLoading,
    loadError: query.isError,
    retry: query.refetch,
    busy: setGroupState.isLoading || createState.isLoading || setMainState.isLoading,
    error,
    dialog,
    dialogError,
    groupOptions: (groups.data ?? []).filter((group) => group.id !== currentGroupId),
    groupsLoading: groups.isFetching,
    setSearch,
    openMove: () => {
      setDialogError(null);
      setSearch('');
      setDialog('move');
    },
    openCreate: () => {
      setDialogError(null);
      setDialog('create');
    },
    closeDialog: () => setDialog(null),
    moveTo: (groupId: number) => change({ groupId }, true),
    remove: () => change({ noGroup: true }, false),
    automatic: () => change({ automatic: true }, false),
    createGroup: async (name: string) => {
      if (categoryId === null) return;
      setDialogError(null);
      try {
        await create({ categoryId, name, productId }).unwrap();
        setDialog(null);
      } catch (cause) {
        setDialogError(productAttributesErrorMessage(cause));
      }
    },
    setMain: async (memberId: number) => {
      if (currentGroupId === undefined) return;
      setError(null);
      try {
        await setMain({ groupId: currentGroupId, productId: memberId }).unwrap();
      } catch (cause) {
        setError(productAttributesErrorMessage(cause));
      }
    },
  };
}
