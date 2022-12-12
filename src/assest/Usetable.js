import React, { useState } from 'react';
import {
	Table,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const styles = makeStyles((theme) => ({
	table: {
		maxWidth: '75%',
		border: 'grey 3px solid',
		margin: '10px auto',
		borderRadius: '1px',
		'& thead th': {
			fontWeight: 'bold',
			background: '#198bd2',
			color: '#fff',
			fontSize: '1.2em',
			textAlign: 'center',
			border: 'white 2px solid',
		},
		'& tbody td': {
			textAlign: 'center',
			border: 'white 2px solid',
			fontSize: '0.99em',
		},
		'& tbody tr': {
			background: '#f4f7f8',
			borderBottom: '1px solid #fff',
			marginBottom: '5px',
			border: 'white 2px solid',
		},
		'& tbody tr:nth-child(even)': {
			background: '#e8eeef',
		},
	},
	pagination: {
		display: 'flex',
		justifyContent: 'center',
		width: '100%',
		alignItems: 'left',
		padding: '0px',
		fontSize: '1.2em',
	},
}));

export default function Usetable(records, headcells) {
	const classes = styles();

	const TblContainer = (props) => (
		<Table className={classes.table}>{props.children}</Table>
	);

	const pages = [25, 5, 10, 50, 100];

	const [page, setPage] = useState(0);

	const [rowsPerPage, setRowsPerPage] = useState(pages[page]);

	const TblHead = (props) => {
		return (
			<TableHead>
				<TableRow>
					{headcells.map((headcell) => (
						<TableCell key={headcell.id}>{headcell.label}</TableCell>
					))}
				</TableRow>
			</TableHead>
		);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const TblPagination = () => (
		<TablePagination
			component="div"
			rowsPerPageOptions={pages}
			rowsPerPage={rowsPerPage}
			count={records.length}
			page={page}
			onPageChange={handleChangePage}
			onRowsPerPageChange={handleChangeRowsPerPage}
			className={classes.pagination}
		/>
	);

	const recordsAfterPagination = () => {
		return records.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
	};

	return {
		TblContainer,
		TblHead,
		TblPagination,
		recordsAfterPagination,
	};
}
