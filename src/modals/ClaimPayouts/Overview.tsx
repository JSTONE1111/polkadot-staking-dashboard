// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonSubmit, ModalNotes } from '@polkadot-cloud/react';
import { forwardRef } from 'react';
import { usePayouts } from 'contexts/Payouts';
import BigNumber from 'bignumber.js';
import { Item } from './Item';
import { ContentWrapper } from './Wrappers';
import type { OverviewProps } from './types';

export const Overview = forwardRef(
  ({ setSection, setPayouts }: OverviewProps, ref: any) => {
    const { unclaimedPayouts } = usePayouts();

    const claimAllPayouts = Object.entries(unclaimedPayouts || {}).map(
      ([era, validatorPayout]) => ({
        era,
        payout: Object.entries(validatorPayout)
          .reduce(
            (acc: BigNumber, [, amount]) => acc.plus(amount),
            new BigNumber(0)
          )
          .toString(),
        validators: Object.keys(validatorPayout),
      })
    );

    return (
      <ContentWrapper>
        <div className="padding" ref={ref}>
          <div style={{ margin: '1rem 0 0.5rem 0' }}>
            <ButtonSubmit
              disabled={Object.values(unclaimedPayouts || {}).length === 0}
              text="Claim All"
              onClick={() => {
                setPayouts(claimAllPayouts);
                setSection(1);
              }}
            />
          </div>

          {Object.entries(unclaimedPayouts || {}).map(
            ([era, unclaimedPayout]: any, i: number) => (
              <Item
                key={`unclaimed_payout_${i}`}
                era={era}
                unclaimedPayout={unclaimedPayout}
                setPayouts={setPayouts}
                setSection={setSection}
              />
            )
          )}
          <ModalNotes withPadding>
            <p>
              Claiming a payout claims on behalf of every nominator backing the
              validator for the era you are claiming for. For this reason,
              transaction fees are usually higher, and most nominators rely on
              the validator to claim on their behalf.
            </p>
            <p>
              Validators usually claim payouts on behalf of their nominators. If
              you decide not to claim here, it is likely you will receive your
              payouts within 1-2 days of them becoming available.
            </p>
          </ModalNotes>
        </div>
      </ContentWrapper>
    );
  }
);
