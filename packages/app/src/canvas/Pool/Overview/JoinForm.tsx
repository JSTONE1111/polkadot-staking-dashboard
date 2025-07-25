// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit, unitToPlanck } from '@w3ux/utils'
import type BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { usePoolSetups } from 'contexts/PoolSetups'
import { defaultPoolProgress } from 'contexts/PoolSetups/defaults'
import { defaultClaimPermission } from 'global-bus'
import { useAccountBalances } from 'hooks/useAccountBalances'
import { useBatchCall } from 'hooks/useBatchCall'
import { useBondGreatestFee } from 'hooks/useBondGreatestFee'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { BondFeedback } from 'library/Form/Bond/BondFeedback'
import { ClaimPermissionInput } from 'library/Form/ClaimPermissionInput'
import { SubmitTx } from 'library/SubmitTx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ClaimPermission } from 'types'
import { useOverlay } from 'ui-overlay'
import type { OverviewSectionProps } from '../types'
import { JoinFormWrapper } from '../Wrappers'

export const JoinForm = ({ bondedPool }: OverviewSectionProps) => {
  const { t } = useTranslation()
  const { serviceApi } = useApi()
  const { network } = useNetwork()
  const {
    closeCanvas,
    config: { options },
  } = useOverlay().canvas
  const { newBatchCall } = useBatchCall()
  const { setPoolSetup } = usePoolSetups()
  const { activeAddress } = useActiveAccounts()
  const { getSignerWarnings } = useSignerWarnings()
  const {
    balances: {
      pool: { totalPossibleBond },
    },
  } = useAccountBalances(activeAddress)

  const { unit, units } = getStakingChainData(network)
  const largestTxFee = useBondGreatestFee({ bondFor: 'pool' })

  // Pool claim permission value.
  const [claimPermission, setClaimPermission] = useState<ClaimPermission>(
    defaultClaimPermission
  )

  // Bond amount to join pool with.
  const [bond, setBond] = useState<{ bond: string }>({
    bond: planckToUnit(totalPossibleBond, units),
  })

  // Whether the bond amount is valid.
  const [bondValid, setBondValid] = useState<boolean>(false)

  // feedback errors to trigger modal resize
  const [feedbackErrors, setFeedbackErrors] = useState<string[]>([])

  // Handler to set bond on input change.
  const handleSetBond = (value: { bond: BigNumber }) => {
    setBond({ bond: value.bond.toString() })
  }

  // Whether the form is ready to submit.
  const formValid = bondValid && feedbackErrors.length === 0

  const getTx = () => {
    if (!claimPermission || !formValid) {
      return
    }
    const txs = serviceApi.tx.joinPool(
      bondedPool.id,
      unitToPlanck(!bondValid ? 0 : bond.bond, units),
      claimPermission
    )
    if (!txs || (txs && !txs.length)) {
      return
    }
    return txs.length === 1 ? txs[0] : newBatchCall(txs, activeAddress)
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAddress,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      closeCanvas()
      // Optional callback function on join success.
      const onJoinCallback = options?.onJoinCallback
      if (typeof onJoinCallback === 'function') {
        onJoinCallback()
      }
    },
    callbackInBlock: async () => {
      // Reset local storage setup progress
      setPoolSetup(defaultPoolProgress)
    },
  })

  const warnings = getSignerWarnings(
    activeAddress,
    false,
    submitExtrinsic.proxySupported
  )

  return (
    <JoinFormWrapper>
      <h2>{t('joinPool', { ns: 'pages' })}</h2>
      <h4>
        {t('bond', { ns: 'app' })} {unit}
      </h4>
      <div className="input">
        <div>
          <BondFeedback
            joiningPool
            displayFirstWarningOnly
            syncing={largestTxFee.isZero()}
            bondFor={'pool'}
            listenIsValid={(valid, errors) => {
              setBondValid(valid)
              setFeedbackErrors(errors)
            }}
            defaultBond={null}
            setters={[handleSetBond]}
            parentErrors={warnings}
            txFees={BigInt(largestTxFee.toString())}
            bonding={false}
          />
        </div>
      </div>
      <h4 className="underline">{t('claimSetting', { ns: 'app' })}</h4>
      <ClaimPermissionInput
        current={claimPermission}
        onChange={(val: ClaimPermission) => {
          setClaimPermission(val)
        }}
      />
      <div className="submit">
        <SubmitTx
          displayFor="card"
          submitText={t('joinPool', { ns: 'pages' })}
          valid={formValid}
          {...submitExtrinsic}
          noMargin
        />
      </div>
    </JoinFormWrapper>
  )
}
