import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ReactComponent as FindIcon } from '../../images/find.svg';
import { ReactComponent as SelectIcon } from '../../images/select.svg';

import transactionsOperations from '../../redux/slices/transactions/transactions-operations';

export function TransactionsFilter() {
	const [inputField, setInputField] = useState('');
	const [filterOption, setFilterOption] = useState('Address');
	const [placeholderValue, setPlaceholderValue] = useState('Search...');

	const dispatch = useDispatch();

	const onInputHandler = (e) => {
		setInputField(e.target.value);
		if (placeholderValue !== 'Search...') {
			setPlaceholderValue('Search...');
		}
	};

	const onChangeFilterHandler = (e) => {
		setFilterOption(e.target.value);
	};

	const validationInputData = (data, option) => {
		const numberPattern = /^\d+$/;
		const hexPattern = /^0x[a-z0-9]+$/;
		data.trim();
		if (data) {
			const checkNumData = numberPattern.test(data);
			const checkHexData = hexPattern.test(data);
			if (checkNumData && option === 'Block Number') {
				return true;
			}
			if (checkHexData && option !== 'Block Number') {
				return true;
			}
		}
		return false;
	};

	const onSubmitHandler = (e) => {
		e.preventDefault();
		setPlaceholderValue('Search...');
		const validData = validationInputData(inputField, filterOption);
		if (validData) {
			dispatch(
				transactionsOperations.getTransactionsByFilter({
					serchData: inputField,
					condition: filterOption,
				})
			);
		} else {
			setInputField('');
			setPlaceholderValue('... invalid data');
		}
	};

	return (
		<div className="filter-section">
			<form className="filter-form" onSubmit={onSubmitHandler}>
				<div className="filter-input-container">
					<input
						className="filter-input"
						placeholder={placeholderValue}
						onInput={onInputHandler}
						value={inputField}
					/>
					<select
						className="filter-select"
						onChange={onChangeFilterHandler}
					>
						<option>Address</option>
						<option>ID transaction</option>
						<option>Block Number</option>
					</select>
					<SelectIcon className="filter-select-icon" />
				</div>
				<button
					className="filter-submit-btn"
					type="button"
					onClick={onSubmitHandler}
				>
					<FindIcon className="filter-submit-btn-icon" />
				</button>
			</form>
		</div>
	);
}
