// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { MaybeString } from 'types';
import * as defaults from './defaults';
import {
  HelpContextInterface,
  HelpContextProps,
  HelpContextState,
} from './types';

export const HelpContext = React.createContext<HelpContextInterface>(
  defaults.defaultHelpContext
);

export const useHelp = () => React.useContext(HelpContext);

export const HelpProvider = ({ children }: HelpContextProps) => {
  // help module state
  const [state, setState] = useState<HelpContextState>({
    status: 0,
    definition: null,
  });

  // when fade out completes, reset active definiton
  useEffect(() => {
    if (state.status === 0) {
      setState({
        ...state,
        definition: null,
      });
    }
  }, [state.status]);

  const setDefinition = (definition: MaybeString) => {
    const _state = {
      ...state,
      definition,
    };
    setState(_state);
  };

  const setStatus = (newStatus: number) => {
    const _state = {
      ...state,
      status: newStatus,
    };
    setState(_state);
  };

  const openHelp = (definition: MaybeString) => {
    setState({
      ...state,
      definition,
      status: 1,
    });
  };

  const closeHelp = () => {
    setState({
      ...state,
      status: 2,
    });
  };

  return (
    <HelpContext.Provider
      value={{
        openHelp,
        closeHelp,
        setStatus,
        setDefinition,
        status: state.status,
        definition: state.definition,
      }}
    >
      {children}
    </HelpContext.Provider>
  );
};
