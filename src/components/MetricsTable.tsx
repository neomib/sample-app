import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import orderBy from "lodash.orderby";
import moment from 'moment';
import { FC, useEffect, useState, } from 'react';
import { DataFields, DataItem } from '../types/DataTypes';
import { currencyFormatter, getDateString } from '../utils';

const columns: GridColDef<DataItem>[] = [
    {
        field: DataFields.Timestamp,
        headerName: 'Date',
        width: 150,
        valueGetter: (params: GridValueGetterParams<DataItem>) =>
            moment(params.row.timestamp).format("MMM Do YY HH:mm"),
    },
    { field: DataFields.Impressions, headerName: 'Impressions', type: 'number', width: 150, },
    { field: DataFields.Conversions, headerName: 'Conversions', type: 'number', width: 150, },
    { field: DataFields.Clicks, headerName: 'Clicks', type: 'number', width: 150, },
    {
        field: DataFields.Cost, headerName: 'Cost',
        type: 'number',
        width: 150,
        valueFormatter: ({ value }) => currencyFormatter.format(value),
    },

];

interface MetricsTableProps {
    data: DataItem[];
}

type Props = MetricsTableProps;


const MetricsTable: FC<Props> = (props: Props) => {
    const { data } = props;
    const [dates, setDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [currentItems, setCurrentItems] = useState<Array<DataItem & { id: number }>>([]);

    useEffect(() => {
        // Builds the dates list for the "select"
        const dateStrings = new Set<string>();
        data.forEach((d) => {
            const date = getDateString(d.timestamp);
            dateStrings.add(date);
        });
        const datesArr = orderBy(Array.from(dateStrings));
        setDates(datesArr);
        setSelectedDate(datesArr[0])
    }, [data]);

    // Updates the currentItems each time the selectedDate is changed
    useEffect(() => {
        if (selectedDate) {
            setCurrentItems(data.filter(d => getDateString(d.timestamp) === selectedDate)
                .map((item, index) => ({ ...item, id: index })));
        }
    }, [selectedDate, data]);

    const handleDateChange = (event: SelectChangeEvent) => {
        setSelectedDate(event.target.value);
    };

    return <Box>
        <Box display="flex" justifyContent="space-between" mb={2} alignItems="center">
            <Typography variant="h6">Metrics</Typography>
            <Select size='small' value={selectedDate} onChange={handleDateChange}>
                {dates.map(date => <MenuItem value={date}>{date}</MenuItem>)}
            </Select>
        </Box>
        <Box sx={{
            '& .font-tabular-nums': {
                fontVariantNumeric: 'tabular-nums',
            },
        }}>
            <DataGrid
                rows={currentItems}
                columns={columns}
                density='comfortable'
                loading={currentItems.length === 0}
                disableRowSelectionOnClick
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
            />
        </Box>
    </Box>;
}


export default MetricsTable;

