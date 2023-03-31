import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { ProductionContext } from '../context/productions/ProductionContext';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Navbar } from "../components/Navbar";

export const Productions = () => {
    const { token, user, randomProduction, productions, ratings, setRandomProduction, setProductions, setUserRatings, createProductionRating, editProductionRating } = useContext(ProductionContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            setRandomProduction();
            setProductions({ name: '', genre: [], type: '' }, '');
            setUserRatings();
        } else {
            navigate(`/`);
        }
    }, []);

    const [name, setName] = useState('');
    const [genre, setGenre] = useState([]);
    const [type, setType] = useState('');
    const [order, setOrder] = useState('');

    const handleChange = (event) => {
        let query = {
            name,
            genre,
            type
        }

        let order = '';

        if (event.target.id === "name-textfield") {
            setName(event.target.value);
            query.name = event.target.value
        }

        if (event.target.name === "genre") {
            setGenre(event.target.value);
            query.genre = event.target.value;
        }

        if (event.target.name === "type") {
            setType(event.target.value);
            query.type = event.target.value;
        }

        if (event.target.name === "order") {
            setOrder(event.target.value);
            order = event.target.value;
        }

        setProductions(query, order);
    };

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const genres = [
        'Acción',
        'Aventura',
        'Animación',
        'Comedia',
        'Documental',
        'Drama',
        'Fantasía',
        'Horror',
        'Musical',
        'Misterio',
        'Romántico',
        'Ciencia ficción',
        'Suspense',
        'Thriller',
        'Western'
    ];

    return (
        <div>
            <Navbar />
            <Typography sx={{ ml: 2, mt: 2 }} variant="h4">Producción Aleatoria</Typography>
            <Card sx={{
                m: 2, ':hover': {
                    boxShadow: 20,
                }
            }}>
                <CardContent>
                    <Grid>
                        <Grid container justify="space-between">
                            <Typography sx={{ ml: 2 }} inline="true" variant="body1" align="left" fontWeight={'bold'}>{randomProduction?.name}</Typography>
                        </Grid>
                        <Grid container justify="space-between">
                            <Typography sx={{ ml: 2 }} inline="true" variant="body1" align="left" fontWeight={'bold'}>Género:&nbsp;</Typography>
                            <Typography inline="true" align="right" variant="body1">{randomProduction?.genre}</Typography>
                        </Grid>
                        <Grid container justify="space-between">
                            <Typography sx={{ ml: 2 }} inline="true" variant="body1" align="left" fontWeight={'bold'}>Tipo:&nbsp;</Typography>
                            <Typography inline="true" align="right" variant="body1">{randomProduction?.type}</Typography>
                        </Grid>
                        <Grid container justify="space-between">
                            <Typography sx={{ ml: 2 }} inline="true" variant="body1" align="left" fontWeight={'bold'}>N° de visualizaciones:&nbsp;</Typography>
                            <Typography inline="true" align="right" variant="body1">{randomProduction?.visualizations}</Typography>
                        </Grid>
                        <Grid container justify="space-between">
                            <Typography sx={{ ml: 2 }} inline="true" variant="body1" align="left" fontWeight={'bold'}>Calificación:&nbsp;</Typography>
                            <Typography inline="true" align="right" variant="body1">{randomProduction?.rating}</Typography>
                        </Grid>
                        <Stack spacing={2} direction="row">
                            {ratings.findIndex(rating => rating.production._id === randomProduction._id && rating.viewed === true) === -1 ? <Button onClick={() => {
                                let index = ratings.findIndex(rating => rating.production._id === randomProduction._id);
                                if (index !== -1) {
                                    let newRating = ratings[index];
                                    newRating.viewed = true;
                                    editProductionRating(newRating._id, newRating);
                                } else {
                                    let newRating = {
                                        user: user._id,
                                        production: randomProduction._id,
                                        viewed: true
                                    }
                                    createProductionRating(newRating);
                                }
                            }} variant="contained">Marcar como vista</Button> : <Typography sx={{ mx: 2 }} variant="body1">Has visto esta producción</Typography>}
                            {ratings.findIndex(rating => rating.production._id === randomProduction._id && rating.value) === -1 ? <Grid>
                                <InputLabel id="rating-per-production-label">Calificación</InputLabel>
                                <Select
                                    labelId="rating-per-production-label"
                                    label="Calificación"
                                    onChange={(event) => {
                                        let index = ratings.findIndex(rating => rating.production._id === randomProduction._id);
                                        if (index !== -1) {
                                            let newRating = ratings[index];
                                            newRating.value = event.target.value;
                                            editProductionRating(newRating._id, newRating);
                                        } else {
                                            let newRating = {
                                                user: user._id,
                                                production: randomProduction._id,
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
                            </Grid> : <Typography sx={{ mx: 2 }} variant="body1">Has calificado esta producción con un {ratings[ratings.findIndex(rating => rating.production._id === randomProduction._id)].value}</Typography>}
                        </Stack>
                    </Grid>
                </CardContent>
            </Card>
            <Button sx={{ mx: 2 }} onClick={setRandomProduction} variant="contained">Genear nueva producción aleatoria</Button>
            <Typography sx={{ ml: 2, mt: 2 }} variant="h4">Lista de Producciones</Typography>

            <Stack spacing={2} direction="row">
                <Typography sx={{ ml: 2, mt: 2 }} variant="body1">Busar por:&nbsp;</Typography>
                <InputLabel id="name-label">Nombre</InputLabel>
                <TextField labelId="genre-label" id="name-textfield" label="Nombre" value={name} onChange={handleChange} />

                <InputLabel id="genre-label">Género</InputLabel>
                <Select
                    labelId="genre-label"
                    id="genre-select"
                    multiple
                    value={genre}
                    name="genre"
                    onChange={handleChange}
                    input={<OutlinedInput label="Género" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >
                    {genres.map((genrel) => (
                        <MenuItem key={genrel} value={genrel}>
                            <Checkbox checked={genre.indexOf(genrel) > -1} />
                            <ListItemText primary={genrel} />
                        </MenuItem>
                    ))}
                </Select>

                <InputLabel id="type-label">Tipo</InputLabel>
                <Select
                    labelId="type-label"
                    id="type-select"
                    value={type}
                    label="Tipo"
                    onChange={handleChange}
                    name="type"
                >
                    <MenuItem value={''}>--Tipo--</MenuItem>
                    <MenuItem value={'Pelicula'}>Pelicula</MenuItem>
                    <MenuItem value={'Serie'}>Serie</MenuItem>
                </Select>

                <Typography sx={{ ml: 2, mt: 2 }} variant="body1">Ordenar por:&nbsp;</Typography>
                <Select
                    id="order-select"
                    value={order}
                    label="Ordenar"
                    onChange={handleChange}
                    name="order"
                >
                    <MenuItem value={''}>--Ordenar--</MenuItem>
                    <MenuItem value={'name'}>Nombre</MenuItem>
                    <MenuItem value={'genre'}>Género</MenuItem>
                    <MenuItem value={'type'}>Tipo</MenuItem>
                    <MenuItem value={'rating'}>Rating</MenuItem>
                </Select>
            </Stack>
            {productions.map(production => {
                return (
                    <Card sx={{
                        m: 2, ':hover': {
                            boxShadow: 20,
                        }
                    }} key={production._id}>
                        <CardContent>
                            <Grid>
                                <Grid container justify="space-between">
                                    <Typography sx={{ ml: 2 }} inline="true" variant="body1" align="left" fontWeight={'bold'}>{production.name}</Typography>
                                </Grid>
                                <Grid container justify="space-between">
                                    <Typography sx={{ ml: 2 }} inline="true" variant="body1" align="left" fontWeight={'bold'}>Género:&nbsp;</Typography>
                                    <Typography inline="true" align="right" variant="body1">{production.genre}</Typography>
                                </Grid>
                                <Grid container justify="space-between">
                                    <Typography sx={{ ml: 2 }} inline="true" variant="body1" align="left" fontWeight={'bold'}>Tipo:&nbsp;</Typography>
                                    <Typography inline="true" align="right" variant="body1">{production.type}</Typography>
                                </Grid>
                                <Grid container justify="space-between">
                                    <Typography sx={{ ml: 2 }} inline="true" variant="body1" align="left" fontWeight={'bold'}>N° de visualizaciones:&nbsp;</Typography>
                                    <Typography inline="true" align="right" variant="body1">{production.visualizations}</Typography>
                                </Grid>
                                <Grid container justify="space-between">
                                    <Typography sx={{ ml: 2 }} inline="true" variant="body1" align="left" fontWeight={'bold'}>Calificación:&nbsp;</Typography>
                                    <Typography inline="true" align="right" variant="body1">{production.rating}</Typography>
                                </Grid>
                                <Stack spacing={2} direction="row">
                                    {ratings.findIndex(rating => rating.production._id === production._id && rating.viewed === true) === -1 ? <Button onClick={() => {
                                        let index = ratings.findIndex(rating => rating.production._id === production._id);
                                        if (index !== -1) {
                                            let newRating = ratings[index];
                                            newRating.viewed = true;
                                            editProductionRating(newRating._id, newRating);
                                        } else {
                                            let newRating = {
                                                user: user._id,
                                                production: production._id,
                                                viewed: true
                                            }
                                            createProductionRating(newRating);
                                        }
                                    }} variant="contained">Marcar como vista</Button> : <Typography sx={{ mx: 2 }} variant="body1">Has visto esta producción</Typography>}
                                    {ratings.findIndex(rating => rating.production._id === production._id && rating.value) === -1 ? <Grid>
                                        <InputLabel id="rating-per-production-label">Calificación</InputLabel>
                                        <Select
                                            labelId="rating-per-production-label"
                                            label="Calificación"
                                            onChange={(event) => {
                                                let index = ratings.findIndex(rating => rating.production._id === production._id);
                                                if (index !== -1) {
                                                    let newRating = ratings[index];
                                                    newRating.value = event.target.value;
                                                    editProductionRating(newRating._id, newRating);
                                                } else {
                                                    let newRating = {
                                                        user: user._id,
                                                        production: production._id,
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
                                    </Grid> : <Typography sx={{ mx: 2 }} variant="body1">Has calificado esta producción con un {ratings[ratings.findIndex(rating => rating.production._id === production._id)].value}</Typography>}
                                </Stack>
                            </Grid>
                        </CardContent>
                    </Card>);
            })}
        </div>
    );
};