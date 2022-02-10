import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ReactComponent as ArrowLeftIcon } from '../../images/arr-left.svg';
import { ReactComponent as ArrowRightIcon } from '../../images/arr-right.svg';
import transactionsSelectors from '../../redux/slices/transactions/transactions-selectors';

export function Pagination() {
	const { page } = useParams();
	const navigate = useNavigate();
	const transactionsList = useSelector(
		transactionsSelectors.transactionsData
	);
	const isLoadedTransactions = useSelector(
		transactionsSelectors.transactionsLodedStatus
	);

	const [paginatedPageList, setPaginatedPageList] = useState([]);
	const [isShoPaginationList, setIsShoPaginationList] = useState(false);
	const [isShowArrowL, setIsShowArrowL] = useState(false);
	const [isShowArrowR, setIsShowArrowR] = useState(false);

	const goPage = useCallback(
		(targetPage) => navigate(`/transactions/${targetPage}`),
		[navigate]
	);

	const pageList = useCallback(
		(pageNumber, dataList) => {
			if (pageNumber < 1) {
				return goPage(1);
			}
			if (Math.ceil(dataList.length / 14) === 0) {
				setPaginatedPageList([]);
			}
			if (
				Math.ceil(dataList.length / 14) < 5 &&
				pageNumber <= Math.ceil(dataList.length / 14)
			) {
				let tempPageLis = [];
				for (let i = 1; i <= Math.ceil(dataList.length / 14); i++) {
					tempPageLis.push(i);
				}
				setPaginatedPageList(tempPageLis);
				return goPage(pageNumber);
			}
			if (pageNumber <= 2 && Math.ceil(dataList.length / 14) >= 5) {
				setPaginatedPageList([1, 2, 3, 4, 5]);
				return goPage(pageNumber);
			}
			if (
				pageNumber > 2 &&
				pageNumber < Math.ceil(dataList.length / 14) - 2 &&
				Math.ceil(dataList.length / 14) >= 5
			) {
				setPaginatedPageList([
					parseInt(pageNumber) - 2,
					parseInt(pageNumber) - 1,
					parseInt(pageNumber),
					parseInt(pageNumber) + 1,
					parseInt(pageNumber) + 2,
				]);
				return goPage(pageNumber);
			}
			if (pageNumber >= Math.ceil(dataList.length / 14) - 2) {
				setPaginatedPageList([
					Math.ceil(dataList.length / 14) - 4,
					Math.ceil(dataList.length / 14) - 3,
					Math.ceil(dataList.length / 14) - 2,
					Math.ceil(dataList.length / 14) - 1,
					Math.ceil(dataList.length / 14),
				]);
				if (pageNumber > Math.ceil(dataList.length / 14)) {
					return goPage(Math.ceil(dataList.length / 14));
				}
				return goPage(pageNumber);
			}
		},
		[goPage]
	);

	const onButtonHandler = (e) => {
		if (e.target.name !== page) {
			pageList(e.target.name, transactionsList);
			goPage(e.target.name);
		}
	};

	const onArrowHandler = (e) => {
		let target = e.target.name;
		if (!e.target.name) {
			if (e.target.nodeName === 'svg') {
				target = e.target.parentNode.name;
			}
			if (e.target.nodeName === 'path') {
				target = e.target.parentNode.parentNode.name;
			}
		}
		if (target === 'arrowLeft') {
			if (page > 1) {
				goPage(parseInt(page) - 1);
				if (paginatedPageList[2] > 3) {
					const newPageList = paginatedPageList.map(
						(page) => page - 1
					);
					return setPaginatedPageList(newPageList);
				}
			}
			return;
		}
		if (target === 'arrowRight') {
			if (
				parseInt(page) + 1 <
				Math.ceil(transactionsList.length / 14) - 1
			) {
				const newPageList = paginatedPageList.map((page) => page + 1);
				goPage(parseInt(page) + 1);
				return setPaginatedPageList(newPageList);
			}
			if (parseInt(page) + 1 <= Math.ceil(transactionsList.length / 14)) {
				goPage(parseInt(page) + 1);
			}
			return;
		}
	};

	const currentPage = (pageNumber) => {
		if (pageNumber === parseInt(page)) {
			return 'current';
		}
		return '';
	};

	useEffect(() => {
		if (isLoadedTransactions === 'fulfilled' && transactionsList.length) {
			pageList(page, transactionsList);
			setIsShoPaginationList(true);
		} else {
			setIsShoPaginationList(false);
			setIsShowArrowL(false);
			setIsShowArrowR(false);
		}
	}, [isLoadedTransactions, page, pageList, transactionsList]);

	useEffect(() => {
		if (parseInt(page) <= 1) {
			setIsShowArrowL(false);
		} else {
			setIsShowArrowL(true);
		}
		if (
			parseInt(page) === Math.ceil(transactionsList.length / 14) ||
			!transactionsList.length
		) {
			setIsShowArrowR(false);
		} else {
			setIsShowArrowR(true);
		}
	}, [page, setIsShowArrowL, setIsShowArrowR, transactionsList.length]);

	return (
		<div className="pagination">
			<div className="pagination-section">
				{isShowArrowL && (
					<button
						className="pagination-link-left"
						onClick={onArrowHandler}
						name="arrowLeft"
					>
						<ArrowLeftIcon className="pagination-left-icon" />
					</button>
				)}
				{isShoPaginationList && (
					<ul className="pagination-list">
						{paginatedPageList.map((page) => {
							return (
								<li key={page} className="pagination-item">
									<button
										className={`pagination-btn ${currentPage(
											page
										)}`.trim()}
										onClick={onButtonHandler}
										name={page}
									>
										{page}
									</button>
								</li>
							);
						})}
					</ul>
				)}
				{isShowArrowR && (
					<button
						className="pagination-link-right"
						onClick={onArrowHandler}
						name="arrowRight"
					>
						<ArrowRightIcon className="pagination-right-icon" />
					</button>
				)}
			</div>
		</div>
	);
}
