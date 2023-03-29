// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ProxiesContextInterface } from './type';

export const defaultProxiesContext: ProxiesContextInterface = {
  proxies: [],
  delegates: {},
  // eslint-disable-next-line
  getProxiedAccounts: (a) => [],
};
