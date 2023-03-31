import React, { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ProductionContext } from '../context/productions/ProductionContext';
import { Formik, Form } from 'formik';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import * as Yup from 'yup';
import Link from "@mui/material/Link";

const LoginSchema = Yup.object().shape({
    username: Yup.string()
        .min(3, 'El nombre de usuario es muy corta!')
        .max(64, 'El nombre de usuario es muy largo!')
        .required('Requerido'),
    password: Yup.string()
        .min(6, 'La contraseña es muy corta!')
        .max(64, 'La contraseña es muy larga!')
        .required('Requerido')

});

export const Login = () => {
    const navigate = useNavigate();
    const { token, setToken, user } = useContext(ProductionContext);

    useEffect(() => {
        if (token && user.username !== "fabian") {
            navigate(`/productions`);
        } else if (token && user.username === "fabian") {
            navigate(`/admin`);
        }
    }, [token]);

    const handleSubmitForm = (values) => {
        setToken({ login: values });
    }

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}
        >
            <Grid item xs={3}>
                <Card sx={{ minWidth: 1 / 4 }} className="vertical-center">
                    <CardContent>
                        <Formik
                            initialValues={{
                                username: '',
                                password: '',
                            }}
                            validationSchema={LoginSchema}
                            onSubmit={handleSubmitForm}
                        >
                            {({ errors, touched, handleChange, handleBlur, handleSubmit }) => (
                                <Form>
                                    <Grid container spacing={3} alignItems="center" direction={'column'}>
                                        <Grid item xs={12}>
                                            <Typography variant="h4">Iniciar Sesión</Typography>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField onChange={handleChange} name="username" label="Nomre de usuario"
                                                onBlur={handleBlur}
                                                helperText={touched.username && errors.username}
                                                error={touched.username && errors.username} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField onChange={handleChange} name="password" type="password" label="Contraseña"
                                                onBlur={handleBlur}
                                                helperText={touched.password && errors.password}
                                                error={touched.password && errors.password} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button onClick={handleSubmit} type="submit" variant="contained" fullWidth>Inicia Sesión</Button>
                                        </Grid>
                                        <Grid item>
                                            <Link onClick={() => navigate(`/register`)} variant="body2">
                                                No tienes una cuenta? Registrate aquí
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </Form>
                            )}
                        </Formik>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};