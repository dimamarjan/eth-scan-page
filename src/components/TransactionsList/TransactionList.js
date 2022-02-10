import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import transactionsSelectors from '../../redux/slices/transactions/transactions-selectors';
import transactionsOperations from '../../redux/slices/transactions/transactions-operations';
import blocksSelectors from '../../redux/slices/blocks/blocks-selectors';
import blocksOperations from '../../redux/slices/blocks/blocks-operations';

export function TransactionList() {
	const transactionsList = useSelector(
		transactionsSelectors.transactionsData
	);
	const isLoadedTransactions = useSelector(
		transactionsSelectors.transactionsLodedStatus
	);

	const currentBlock = useSelector(blocksSelectors.blockData);

	const [pageList, setPageList] = useState([]);
	const [isShowTxnList, setIsShowTxnList] = useState(false);

	const { page } = useParams();

	const dispatch = useDispatch();

	const bigIntFormat = (hexNumber) => {
		const result = hexNumber / Number(1000000000000000000n);
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

	useEffect(() => {
		if (isLoadedTransactions === 'idle') {
			dispatch(transactionsOperations.getTransactions());
		}
	}, [dispatch, isLoadedTransactions]);

	useEffect(() => {
		if (isLoadedTransactions === 'fulfilled' && transactionsList.length) {
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

	return (
		<div className="transactions">
			<table className="transactions-table">
				<thead>
					<tr className="transactions-table-headers">
						<th>
							Block
							<br />
							number
						</th>
						<th>Transaction ID</th>
						<th>
							Sender
							<br />
							address
						</th>
						<th>
							Recipient's
							<br />
							address
						</th>
						<th>
							Block
							<br />
							confirmations
						</th>
						<th>Date</th>
						<th>Value</th>
						<th>
							Transaction
							<br />
							Fee
						</th>
					</tr>
				</thead>
				<tbody>
					{isShowTxnList &&
						pageList.map((txn) => {
							return (
								<tr key={txn.id} className="transactions-data">
									<td className="transactions-txn-number">
										{txn.blockNumber}
									</td>
									<td className="transactions-txn-hash">
										<a
											className="transactions-link"
											href={`https://etherscan.io/tx/${txn.hash}`}
										>
											{stringValidation(txn.hash, 12)}
										</a>
									</td>
									<td className="transactions-txn-sender">
										{stringValidation(txn.from, 13)}
									</td>
									<td className="transactions-txn-recipient">
										{stringValidation(txn.to, 15)}
									</td>
									<td className="transactions-txn-confirmation">
										{currentBlock - txn.blockNumber}
									</td>
									<td>{txn.date}</td>
									<td>{bigIntFormat(txn.value)}</td>
									<td>====</td>
								</tr>
							);
						})}
				</tbody>
			</table>
		</div>
	);
}
