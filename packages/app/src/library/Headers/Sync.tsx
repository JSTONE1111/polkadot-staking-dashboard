// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { pageFromUri } from '@w3ux/utils'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useTxMeta } from 'contexts/TxMeta'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useSyncing } from 'hooks/useSyncing'
import { useLocation } from 'react-router-dom'
import { Spinner } from 'ui-core/base'

export const Sync = () => {
  const { uids } = useTxMeta()
  const { syncing } = useSyncing()
  const { pathname } = useLocation()
  const { getValidators } = useValidators()
  const { bondedPools } = useBondedPools()

  // Keep syncing if on pools page and still fetching bonded pools or pool members. Ignore pool
  // member sync if Subscan is enabled
  const onPoolsSyncing = () => {
    if (pageFromUri(pathname, 'overview') === 'pools') {
      if (!bondedPools.length) {
        return true
      }
    }
    return false
  }

  // Keep syncing if on validators page and still fetching
  const onValidatorsSyncing = () => {
    if (
      pageFromUri(pathname, 'overview') === 'validators' &&
      !getValidators().length
    ) {
      return true
    }
    return false
  }

  const isSyncing =
    syncing ||
    onPoolsSyncing() ||
    onValidatorsSyncing() ||
    uids.filter(({ submitted }) => submitted).length > 0

  return isSyncing ? (
    <span style={{ marginRight: '1rem' }}>
      <Spinner />
    </span>
  ) : null
}
