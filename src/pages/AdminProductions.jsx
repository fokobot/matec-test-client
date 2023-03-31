import React, { useEffect, useContext } from 'react';
import useWebSocket from 'react-use-websocket';
import { useNavigate } from "react-router-dom";
import { Formik, Form } from 'formik';
import { ProductionContext } from '../context/productions/ProductionContext';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import * as Yup from 'yup';
import CardContent from '@mui/material/CardContent';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Navbar } from "../components/Navbar";
const socketUrl = import.meta.env.VITE_WS_URL;

const CreateProductionSchema = Yup.object().shape({
    name: Yup.string()
        .min(1, 'Name is too short!')
        .max(128, 'Name is too long!')
        .required('Required'),
    genre: Yup.string().required('Required'),
    type: Yup.string().required('Required')
});

export const AdminProductions = () => {
    const { token, productions, setProductions, updateProductionOfTheDay, createProduction } = useContext(ProductionContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            setProductions({ name: '', genre: [], type: '' }, '');
        } else {
            navigate(`/`);
        }
    }, []);

    const { sendMessage } = useWebSocket(socketUrl);

    return (
        <div>
            <Navbar />
            <Typography sx={{ ml: 2, mt: 2 }} variant="h4">Crear Producción</Typography>
            <Box>
                <Formik
                    initialValues={{
                        name: '',
                        genre: '',
                        type: ''
                    }}
                    validationSchema={CreateProductionSchema}
                    onSubmit={createProduction}
                >
                    {({ errors, touched, handleChange, handleBlur, handleSubmit }) => (
                        <Form>
                            <Grid container spacing={3} alignItems="center" direction={'column'}>
                                <Grid item xs={12}>
                                    <TextField onChange={handleChange} name="name" label="Nombre de la producción"
                                        onBlur={handleBlur}
                                        helperText={touched.name && errors.name}
                                        error={touched.name && errors.name} />
                                </Grid>
                                <InputLabel id="genre-label">Género</InputLabel>
                                <Select
                                    labelId="genre-label"
                                    id="genre-select"
                                    label="Género"
                                    onChange={handleChange}
                                    name="genre"
                                >
                                    <MenuItem value={'Acción'}>Acción</MenuItem>
                                    <MenuItem value={'Aventura'}>Aventura</MenuItem>
                                    <MenuItem value={'Animación'}>Animación</MenuItem>
                                    <MenuItem value={'Comedia'}>Comedia</MenuItem>
                                    <MenuItem value={'Documental'}>Documental</MenuItem>
                                    <MenuItem value={'Drama'}>Drama</MenuItem>
                                    <MenuItem value={'Fantasía'}>Fantasía</MenuItem>
                                    <MenuItem value={'Horror'}>Horror</MenuItem>
                                    <MenuItem value={'Musical'}>Musical</MenuItem>
                                    <MenuItem value={'Misterio'}>Misterio</MenuItem>
                                    <MenuItem value={'Romántico'}>Romántico</MenuItem>
                                    <MenuItem value={'Ciencia ficción'}>Ciencia ficción</MenuItem>
                                    <MenuItem value={'Suspense'}>Suspense</MenuItem>
                                    <MenuItem value={'Thriller'}>Thriller</MenuItem>
                                    <MenuItem value={'Western'}>Western</MenuItem>
                                </Select>
                                <InputLabel id="type-label">Tipo</InputLabel>
                                <Select
                                    labelId="type-label"
                                    id="type-select"
                                    label="Tipo"
                                    onChange={handleChange}
                                    name="type"
                                >
                                    <MenuItem value={'Pelicula'}>Pelicula</MenuItem>
                                    <MenuItem value={'Serie'}>Serie</MenuItem>
                                </Select>
                                <Grid justify="space-between" item xs={12}>
                                    <Button sx={{ mx: 1 }} inline="true" onClick={handleSubmit} type="submit" variant="contained">Guardar Producción</Button>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Box >
            <Typography sx={{ ml: 2, mt: 2 }} variant="h4">Lista de Producciones</Typography>
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
                                {production.productionOfTheDay === false &&
                                    <Button variant="contained" color="error"
                                        onClick={() => {
                                            updateProductionOfTheDay(production._id);
                                            setTimeout(() => {
                                                sendMessage("Nueva pelicula del dia");
                                            }, 100);
                                        }}>
                                        Hacer pelicula del dia
                                    </Button>}
                            </Grid>
                        </CardContent>
                    </Card>);
            })}
        </div>
    );
};