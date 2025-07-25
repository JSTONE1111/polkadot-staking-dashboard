// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircleDown } from '@fortawesome/free-solid-svg-icons'
import { minDecimalPlaces, planckToUnit } from '@w3ux/utils'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import { usePayouts } from 'contexts/Payouts'
import { usePlugins } from 'contexts/Plugins'
import { Stat } from 'library/Stat'
import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'

export const UnclaimedPayoutsStatus = ({ dimmed }: { dimmed: boolean }) => {
  const { t } = useTranslation()
  const { network } = useNetwork()
  const { isReady } = useApi()
  const { openModal } = useOverlay().modal
  const {
    unclaimedRewards: { total },
  } = usePayouts()
  const { pluginEnabled } = usePlugins()
  const { activeAddress } = useActiveAccounts()
  const { isReadOnlyAccount } = useImportedAccounts()
  const { units } = getStakingChainData(network)
  return (
    <Stat
      label={t('pendingPayouts', { ns: 'pages' })}
      helpKey="Payout"
      type="odometer"
      stat={{
        value:
          total === '0'
            ? '0.00'
            : minDecimalPlaces(planckToUnit(total, units), 2),
      }}
      dimmed={dimmed}
      buttons={
        total !== '0' &&
        pluginEnabled('staking_api') &&
        !isReadOnlyAccount(activeAddress)
          ? [
              {
                title: t('claim', { ns: 'modals' }),
                icon: faCircleDown,
                disabled: !isReady,
                onClick: () =>
                  openModal({
                    key: 'ClaimPayouts',
                    size: 'sm',
                    options: {
                      disableWindowResize: true,
                      disableScroll: true,
                    },
                  }),
              },
            ]
          : undefined
      }
    />
  )
}
