import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import transactionsSelectors from "../../redux/slices/transactions/transactions-selectors";
import transactionsOperations from "../../redux/slices/transactions/transactions-operations";
import blocksSelectors from "../../redux/slices/blocks/blocks-selectors";
import blocksOperations from "../../redux/slices/blocks/blocks-operations";

export function TransactionList() {
  const transactionsList = useSelector(transactionsSelectors.transactionsData);
  const isLoadedTransactions = useSelector(
    transactionsSelectors.transactionsLodedStatus
  );

  const currentBlock = useSelector(blocksSelectors.blockData);

  const [pageList, setPageList] = useState([]);
  const [isShowTxnList, setIsShowTxnList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isServerErr, setisServerErr] = useState(false);

  const { page } = useParams();

  const dispatch = useDispatch();

  const convertation = (hexNumber) => {
    const result = hexNumber / 10 ** 18;
    return result.toFixed(19);
  };

  const stringValidation = (stringData, len) => {
    if (!stringData) {
      return stringData;
    }
    if (stringData.length <= len) {
      return stringData;
    } else {
      return `${stringData.slice(0, len)}...`;
    }
  };

  const transactionFeeCalculate = (base, max, price, used, type) => {
    if (parseInt(type) === 2) {
      const fee =
        ((parseInt(base) + parseInt(max)) * parseInt(used)) / 10 ** 18;
      return fee.toFixed(10);
    }
    const fee = (parseInt(price) * parseInt(used)) / 10 ** 18;
    return fee.toFixed(10);
  };

  useEffect(() => {
    if (isLoadedTransactions === "idle") {
      dispatch(transactionsOperations.getTransactions());
    }
  }, [dispatch, isLoadedTransactions]);

  useEffect(() => {
    if (isLoadedTransactions === "fulfilled" && transactionsList.length) {
      const dataPerPage = 14 * page;
      dispatch(blocksOperations.getBlock());
      setPageList(transactionsList.slice(dataPerPage - 14, dataPerPage));
      setIsShowTxnList(true);
    } else {
      setIsShowTxnList(false);
    }
  }, [
    dispatch,
    isLoadedTransactions,
    page,
    transactionsList,
    transactionsList.length,
  ]);

  useEffect(() => {
    if (isLoadedTransactions === "pending") {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoadedTransactions]);

  useEffect(() => {
    if (!isLoadedTransactions) {
      setisServerErr(true);
    } else {
      setisServerErr(false);
    }
  }, [isLoadedTransactions]);

  return (
    <div className="transactions">
      {isLoading && (
        <div className="transactions-table-loading">
          <span className="transactions-table-loading-txt">...Loading</span>
        </div>
      )}
      {isServerErr && (
        <div className="transactions-table-loading">
          <span className="transactions-table-loading-txt">
            service is temporarily unavailable
          </span>
        </div>
      )}
      {isShowTxnList && (
        <ul className="transactions-mobile">
          {pageList.map((txn) => {
            return (
              <li key={txn.id} className="transactions-mobile-card">
                <ul className="transactions-mobile-header">
                  <ul className="transactions-mobile-hlist">
                    <li className="transactions-mobile-head">Block number</li>
                    <li className="transactions-mobile-head">Transaction ID</li>
                    <li className="transactions-mobile-head">Sender address</li>
                    <li className="transactions-mobile-head">
                      Recipient's address
                    </li>
                    <li className="transactions-mobile-head">
                      Block confirmations
                    </li>
                    <li className="transactions-mobile-head">Date</li>
                    <li className="transactions-mobile-head">Value</li>
                    <li className="transactions-mobile-head">
                      Transaction Fee
                    </li>
                  </ul>
                </ul>
                <ul className="transactions-mobile-data">
                  <ul className="transactions-mobile-dlist">
                    <li className="transactions-mobile-item">
                      {txn.blockNumber}
                    </li>
                    <li className="transactions-mobile-item">
                      <a
                        className="transactions-link"
                        href={`https://etherscan.io/tx/${txn.hash}`}
                      >
                        {stringValidation(txn.hash, 10)}
                      </a>
                    </li>
                    <li className="transactions-mobile-item">
                      {stringValidation(txn.from, 10)}
                    </li>
                    <li className="transactions-mobile-item">
                      {stringValidation(txn.to, 10)}
                    </li>
                    <li className="transactions-mobile-item">
                      {currentBlock - txn.blockNumber}
                    </li>
                    <li className="transactions-mobile-item">{txn.date}</li>
                    <li className="transactions-mobile-item">
                      {stringValidation(convertation(txn.value), 10)}
                    </li>
                    <li className="transactions-mobile-item">
                      {transactionFeeCalculate(
                        txn.baseFee,
                        txn.maxFee,
                        txn.gasPrice,
                        txn.gasUsed,
                        txn.type
                      )}
                    </li>
                  </ul>
                </ul>
              </li>
            );
          })}
        </ul>
      )}
      {isShowTxnList && (
        <table className="transactions-table">
          <thead className="transactions-table-head">
            <tr className="transactions-table-headers">
              <th>
                <span className="transactions-table-normal">
                  Block
                  <br />
                  number
                </span>
              </th>
              <th>
                <span className="transactions-table-normal">
                  Transaction ID
                </span>
              </th>
              <th className="transactions-table-sender">
                Sender
                <br />
                address
              </th>
              <th className="transactions-table-recipients">
                Recipient's
                <br />
                address
              </th>
              <th className="transactions-table-confirmations">
                <span className="transactions-table-normal">
                  Block
                  <br />
                  confirmations
                </span>
              </th>
              <th>Date</th>
              <th className="transactions-table-value">Value</th>
              <th className="transactions-table-Fee">
                <span className="transactions-table-normal">
                  Transaction
                  <br />
                  Fee
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {pageList.map((txn) => {
              return (
                <tr key={txn.id} className="transactions-data">
                  <td className="transactions-txn-number">{txn.blockNumber}</td>
                  <td className="transactions-txn-hash">
                    <a
                      className="transactions-link"
                      href={`https://etherscan.io/tx/${txn.hash}`}
                    >
                      {stringValidation(txn.hash, 12)}
                    </a>
                  </td>
                  <td className="transactions-table-sender">
                    {stringValidation(txn.from, 13)}
                  </td>
                  <td className="transactions-table-recipients">
                    {stringValidation(txn.to, 15)}
                  </td>
                  <td className="transactions-table-confirmations">
                    {currentBlock - txn.blockNumber}
                  </td>
                  <td>{txn.date}</td>
                  <td className="transactions-table-value">
                    {convertation(txn.value)}
                  </td>
                  <td>
                    {transactionFeeCalculate(
                      txn.baseFee,
                      txn.maxFee,
                      txn.gasPrice,
                      txn.gasUsed,
                      txn.type
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
