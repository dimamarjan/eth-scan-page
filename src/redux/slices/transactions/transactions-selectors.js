const transactionsLodedStatus = (state) => state.transactions.status;

const transactionsData = (state) => state.transactions.txn;

const contactsSelectors = {
    transactionsLodedStatus,
    transactionsData,
};

export default contactsSelectors;