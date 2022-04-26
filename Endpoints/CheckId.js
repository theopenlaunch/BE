const checkAreaId = (id) => {
	let i = 28;
	while (i <= 528) {
		i += 25;
		if (id >= i && id <= i + 20) return false;
	}
	return true;
};

const checkCellId = (id) => {
	let i = 28;
	while (i <= 528) {
		i += 25;
		if (
			id >= convertAreaIdToFirstCellId(i) &&
			id <= convertAreaIdToLastCellId(i + 20)
		)
			return false;
	}
	return true;
};

const convertAreaIdToFirstCellId = (id) => (id - 1) * 16 + 1;
const convertAreaIdToLastCellId = (id) => id * 16 - 1;

exports.checkAreaId = checkAreaId;
exports.checkCellId = checkCellId;
