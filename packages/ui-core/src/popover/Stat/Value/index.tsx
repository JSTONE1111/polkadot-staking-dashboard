// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react'
import classes from './index.module.scss'

export const Value = ({ children }: { children: ReactNode }) => (
  <p className={classes.value}>{children}</p>
)
