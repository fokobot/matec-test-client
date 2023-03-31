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

const SignupSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, 'El nombre es muy corto!')
        .max(50, 'El nombre es muy largo!')
        .required('Required'),
    username: Yup.string()
        .min(3, 'El nombre de usuario es muy corto!')
        .max(64, 'El nombre de usuario es muy largo!')
        .required('Required'),
    password: Yup.string()
        .min(6, 'La contraseña es muy corta!')
        .max(64, 'La contraseña es muy larga!')
        .required('Requerido'),
    passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .min(6, 'La contraseña es muy corta!')
        .max(64, 'La contraseña es muy larga!')
        .required('Requerido'),

});

export const Register = () => {
    const navigate = useNavigate();
    const { token, setToken } = useContext(ProductionContext);

    useEffect(() => {
        if (token) {
            navigate(`/productions`);
        }
    }, [token]);

    const handleSubmit = (values) => {
        setToken({ register: values });
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
                <Card className="vertical-center">
                    <CardContent>
                        <Formik
                            initialValues={{
                                name: '',
                                username: '',
                                password: '',
                                passwordConfirmation: ''
                            }}
                            validationSchema={SignupSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ errors, touched, handleChange, handleSubmit }) => (
                                <Form>
                                    <Grid container spacing={3} alignItems="center" direction={'column'}>
                                        <Grid item xs={12}>
                                            <Typography variant="h4">Registrarse</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField onChange={handleChange} name="name" label="Nombre"
                                                helperText={touched.name && errors.name}
                                                error={touched.name && errors.name} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField onChange={handleChange} name="username" label="Nombre de usuario"
                                                helperText={touched.username && errors.username}
                                                error={touched.username && errors.username} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField onChange={handleChange} name="password" type="password" label="Contraseña"
                                                helperText={touched.password && errors.password}
                                                error={touched.password && errors.password} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField onChange={handleChange} name="passwordConfirmation" type="password" label="Confirma tu contraseña"
                                                helperText={touched.passwordConfirmation && errors.passwordConfirmation}
                                                error={touched.passwordConfirmation && errors.passwordConfirmation} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button onClick={handleSubmit} type="submit" variant="contained" fullWidth>Registrate</Button>
                                        </Grid>
                                        <Grid item>
                                            <Link onClick={() => navigate(`/`)} variant="body2">
                                                Ya tienes una cuenta? Inicia Sesión
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