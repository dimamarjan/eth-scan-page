import { TransactionsFilter } from '../components/TransactionsFilter/TransactionsFilter'
import { TransactionList } from '../components/TransactionsList/TransactionList'
import { Pagination } from '../components/Pagination/Pagination'

export function MainContainer() {
    return (
        <div className="main-container">
            <TransactionsFilter />
            <TransactionList />
            <Pagination />
        </div>
    )
}