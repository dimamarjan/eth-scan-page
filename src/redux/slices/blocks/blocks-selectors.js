const blockLodedStatus = (state) => state.block.status;

const blockData = (state) => state.block.block;

const contactsSelectors = {
    blockLodedStatus,
    blockData,
};

export default contactsSelectors;