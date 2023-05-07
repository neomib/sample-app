import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import { FC, useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import JsonData from '../data/sample.json';
import { DataByFields, DataItem } from '../types/DataTypes';
import { getDateString, numberWithCommas } from '../utils';
import MetricsTable from './MetricsTable';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
);
const options = {
    responsive: true,
    plugins: {

        title: {
            display: true,
        },
    },
};

interface DashboardProps {

}

type Props = DashboardProps;


const Dashboard: FC<Props> = (props: Props) => {
    const data = JsonData.data;
    const [totalCost, setTotalCost] = useState(0);
    const [totalConversions, setTotalConversions] = useState(0);
    const [dataByFields, setDataByFields] = useState<DataByFields>({});

    // Runs once, when the component mounts
    useEffect(() => {
        let cost = 0;
        let conversions = 0;
        // Builds an object to analyze the data by field and month.
        // Keys are  the fields, for each field, we sum the values per month
        const sumFieldsPerDate: DataByFields = {};
        data.forEach(d => {
            const date = getDateString(d.timestamp);
            Object.keys(d).filter(field => !isNaN(Number((d as any)[field])))
                .forEach(field => {
                    if (!sumFieldsPerDate[field]) {
                        sumFieldsPerDate[field] = {};
                    }
                    sumFieldsPerDate[field][date] = (sumFieldsPerDate[field][date] || 0) + (d as any)[field];

                });
            // Calculates the total cost and total conversions number
            cost += d.cost;
            conversions += d.conversions;
        });

        setTotalCost(cost);
        setTotalConversions(conversions);
        setDataByFields(sumFieldsPerDate);
    }, []); //eslint-disable-line

    //Builds chart's data
    const getChartData = (field: keyof DataItem) => {
        if (dataByFields[field]) {
            const labels: string[] = [];
            const dataArr: number[] = [];
            //Builds labels and datasets in the same order
            Object.entries(dataByFields[field])
                .forEach(([date, dateValue]) => {
                    labels.push(date);
                    dataArr.push(dateValue);
                });

            return ({
                labels,
                datasets: [{
                    label: field,
                    data: dataArr,
                    borderColor: 'cornflowerblue',
                    backgroundColor: 'orange',
                }]
            })
        }
        else {
            return ({
                labels: [],
                datasets: []
            })
        }

    }

    return <Container maxWidth="md" >
        <Box py={3} >
            <Box display="flex" gap={2} flexDirection={{ xs: "column", md: "row" }}>
                {/* Total Cost */}
                <Card sx={{ flex: 1 }}>
                    <CardContent >
                        <Box display="flex" gap={2} alignItems="center">
                            <Box color="white"
                                borderRadius="50%"
                                sx={{ background: "cornflowerblue" }}
                                fontWeight={500}
                                height="30px"
                                width="30px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center">
                                $
                            </Box>
                            <Box>
                                <Typography color="text.primary" fontWeight={500} fontSize={{ xs: "0.85rem", md: "0.9rem" }}>Total Cost</Typography>
                                <Typography fontWeight={"bold"} fontSize={{ xs: "1.2rem", md: "1.8rem" }}>{`$${numberWithCommas(Math.round(totalCost))}`}</Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
                {/* Total Conversions */}
                <Card sx={{ flex: 1 }}>
                    <CardContent >
                        <Box display="flex" gap={2} alignItems="center">
                            <Box color="white"
                                borderRadius="50%"
                                sx={{ background: "lightseagreen" }}
                                fontWeight={500}
                                height="30px"
                                width="30px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center">
                                Ξ
                            </Box>
                            <Box>
                                <Typography color="text.primary" fontWeight={500} fontSize={{ xs: "0.85rem", md: "0.9rem" }}>Total Conversions</Typography>
                                <Typography fontWeight={"bold"} fontSize={{ xs: "1.2rem", md: "1.8rem" }}>{numberWithCommas(totalConversions)}</Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
            {/* Charts */}
            <Box mt={2} mb={2} display="flex" gap={2} flexDirection={{ xs: "column", md: "row" }}>
                <Card sx={{ flex: 1 }}>
                    <CardHeader title="Cost By Month" />
                    <CardContent sx={{ paddingTop: 0 }}>
                        <Line options={options} data={getChartData("cost")} />
                    </CardContent>
                </Card>
                <Card sx={{ flex: 1 }}>
                    <CardHeader title="Impressions" />
                    <CardContent sx={{ paddingTop: 0 }}>
                        <Bar options={options} data={getChartData("impressions")} />

                    </CardContent>
                </Card>
            </Box>
            {/* Table */}
            <Card>
                <CardContent>
                    <MetricsTable data={data} />
                </CardContent>
            </Card>
        </Box>
    </Container >
}

export default Dashboard;

