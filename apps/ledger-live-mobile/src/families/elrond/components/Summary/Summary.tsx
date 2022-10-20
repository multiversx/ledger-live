// @flow

import React, { useCallback, useMemo, useEffect, useState, FC } from "react";
import { ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { BigNumber } from "bignumber.js";

import type { DelegationType } from "../../types";

import InfoModal from "../../../../modals/Info";
import InfoItem from "../../../../components/BalanceSummaryInfoItem";

import { denominate } from "../../helpers";
import { constants } from "../../constants";

import type { SummaryPropsType, ItemType } from "./types";
import styles from "./styles";

/*
 * Create a higher order component that will return null if balance is zero (thus unable to delegate).
 */

const withSummary =
  (Component: FC<SummaryPropsType>) => (props: SummaryPropsType) =>
    props.account.elrondResources || props.account.balance.gt(0) ? (
      <Component {...props} />
    ) : null;

/*
 * Handle the component declaration.
 */

const Summary = (props: SummaryPropsType) => {
  const { account } = props;
  const { t } = useTranslation();

  /*
   * Declare the data state (for the dynamic information modal) and the delegation resources state (tracking server updates).
   */

  const [data, setData] = useState<ItemType["modal"][]>([]);
  const [delegationsResources, setDelegationResources] = useState<
    DelegationType[]
  >(account.elrondResources.delegations);

  /*
   * Track delegations array updates and trigger state changes accordingly.
   */

  const fetchDelegations = useCallback(() => {
    setDelegationResources(account.elrondResources.delegations);

    return () => setDelegationResources(account.elrondResources.delegations);
  }, [account.elrondResources.delegations]);

  /*
   * Calculate the total of the requested resource (cumulated unbondings or stake).
   */

  const total = useCallback(
    (key: string): BigNumber =>
      delegationsResources.reduce(
        (total: BigNumber, delegation) => total.plus(delegation[key]),
        new BigNumber(0),
      ),
    [delegationsResources],
  );

  /*
   * Format the three data items by denominating the value and filtering out zero resources.
   */

  const formatItems = useCallback(
    (items: ItemType[]) =>
      items.reduce((total: ItemType[], current: ItemType) => {
        const item: ItemType = Object.assign(current, {
          value: denominate({ input: String(current.value), decimals: 6 }),
          modal: {
            description: t(current.modal.description),
            title: t(current.modal.description),
          },
        });

        return current.show ? total.concat([item]) : total;
      }, []),
    [t],
  );

  /*
   * When closing the information modal, reset the data state.
   */

  const onCloseModal = useCallback(() => {
    setData([]);
  }, []);

  /*
   * Extract the memoized data for total spendable balance, cumulate delegated stake and cumulated unbondings.
   */

  const delegations = useMemo(() => total("userActiveStake"), [total]);
  const unbondings = useMemo(() => total("userUnBondable"), [total]);
  const available = useMemo(() => account.spendableBalance, [account]);

  /*
   * Handle the data displayed, formatted and memoized.
   */

  const items = useMemo(
    () =>
      formatItems([
        {
          title: "account.availableBalance",
          show: true,
          value: available,
          modal: {
            title: "elrond.info.available.title",
            description: "elrond.info.available.description",
          },
        },
        {
          title: "account.delegatedAssets",
          show: delegations.gt(0),
          value: delegations,
          modal: {
            title: "elrond.info.delegated.title",
            description: "elrond.info.delegated.description",
          },
        },
        {
          title: "account.undelegating",
          show: unbondings.gt(0),
          value: unbondings,
          modal: {
            title: "elrond.info.undelegating.title",
            description: "elrond.info.undelegating.description",
          },
        },
      ]),
    [available, delegations, unbondings, formatItems],
  );

  /*
   * Track all callback reference updates and run the effect conditionally.
   */

  useEffect(fetchDelegations, [fetchDelegations]);

  /*
   * Return the rendered component.
   */

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={styles.root}
    >
      <InfoModal
        isOpened={data.length > 0}
        onClose={onCloseModal}
        data={data}
      />

      {items.map((item, index) => (
        <InfoItem
          key={item.title}
          title={t(item.title)}
          onPress={() => setData([item.modal])}
          value={`${item.value} ${constants.egldLabel}`}
          isLast={index === items.length - 1}
        />
      ))}
    </ScrollView>
  );
};

export default withSummary(Summary);
