import React, { useEffect, useContext } from 'react';
import useWebSocket from 'react-use-websocket';
import { useNavigate } from "react-router-dom";
import { ProductionContext } from '../context/productions/ProductionContext';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import { Navbar } from "../components/Navbar";
const socketUrl = import.meta.env.VITE_WS_URL;

export const ProductionOfTheDay = () => {
    const { token, user, productionOfTheDay, ratings, createProductionRating, editProductionRating, setProductionOfTheDay } = useContext(ProductionContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate(`/`);
        }
    }, []);

    const { lastMessage } = useWebSocket(socketUrl);

    useEffect(() => {
        setProductionOfTheDay();
    }, [lastMessage]);

    return (
        <div>
            <Navbar />
            <Typography sx={{ ml: 2, mt: 2 }} variant="h4">Pelicula del día</Typography>
            <Card sx={{
                m: 2, ':hover': {
                    boxShadow: 20,
                }
            }}>
                <CardContent>
                    <Grid>
                        <Grid container justify="space-between">
                            <Typography sx={{ ml: 2 }} inline="true" variant="body1" align="left" fontWeight={'bold'}>{productionOfTheDay?.name}</Typography>
                        </Grid>
                        <Grid container justify="space-between">
                            <Typography sx={{ ml: 2 }} inline="true" variant="body1" align="left" fontWeight={'bold'}>Género:&nbsp;</Typography>
                            <Typography inline="true" align="right" variant="body1">{productionOfTheDay?.genre}</Typography>
                        </Grid>
                        <Grid container justify="space-between">
                            <Typography sx={{ ml: 2 }} inline="true" variant="body1" align="left" fontWeight={'bold'}>Tipo:&nbsp;</Typography>
                            <Typography inline="true" align="right" variant="body1">{productionOfTheDay?.type}</Typography>
                        </Grid>
                        <Grid container justify="space-between">
                            <Typography sx={{ ml: 2 }} inline="true" variant="body1" align="left" fontWeight={'bold'}>N° de visualizaciones:&nbsp;</Typography>
                            <Typography inline="true" align="right" variant="body1">{productionOfTheDay?.visualizations}</Typography>
                        </Grid>
                        <Grid container justify="space-between">
                            <Typography sx={{ ml: 2 }} inline="true" variant="body1" align="left" fontWeight={'bold'}>Calificación:&nbsp;</Typography>
                            <Typography inline="true" align="right" variant="body1">{productionOfTheDay?.rating}</Typography>
                        </Grid>
                        <Stack spacing={2} direction="row">
                            {ratings.findIndex(rating => rating.production._id === productionOfTheDay?._id && rating.viewed === true) === -1 ? <Button onClick={() => {
                                let index = ratings.findIndex(rating => rating.production._id === productionOfTheDay?._id);
                                if (index !== -1) {
                                    let newRating = ratings[index];
                                    newRating.viewed = true;
                                    editProductionRating(newRating._id, newRating);
                                } else {
                                    let newRating = {
                                        user: user._id,
                                        production: productionOfTheDay?._id,
                                        viewed: true
                                    }
                                    createProductionRating(newRating);
                                }
                            }} variant="contained">Marcar como vista</Button> : <Typography sx={{ mx: 2 }} variant="body1">Has visto esta producción</Typography>}
                            {ratings.findIndex(rating => rating.production._id === productionOfTheDay?._id && rating.value) === -1 ? <Grid>
                                <InputLabel id="rating-per-production-label">Calificación</InputLabel>
                                <Select
                                    labelId="rating-per-production-label"
                                    label="Calificación"
                                    onChange={(event) => {
                                        let index = ratings.findIndex(rating => rating.production._id === productionOfTheDay?._id);
                                        if (index !== -1) {
                                            let newRating = ratings[index];
                                            newRating.value = event.target.value;
                                            editProductionRating(newRating._id, newRating);
                                        } else {
                                            let newRating = {
                                                user: user._id,
                                                production: productionOfTheDay?._id,
                                                value: event.target.value
                                            }
                                            createProductionRating(newRating);
                                        }
                                    }}
                                >
                                    <MenuItem value={''}>--Calificación--</MenuItem>
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                </Select>
                            </Grid> : <Typography sx={{ mx: 2 }} variant="body1">Has calificado esta producción con un {ratings[ratings.findIndex(rating => rating.production._id === productionOfTheDay._id)].value}</Typography>}
                        </Stack>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
};