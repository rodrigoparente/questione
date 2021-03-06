import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField, IconButton, MenuItem
} from '@material-ui/core';
import api from "../../../../services/api";
import Swal from "sweetalert2";
import validate from "validate.js";
import {cpfMask} from "../../../../common/mask";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const schema = {
  description: {
    presence: { allowEmpty: false,  message: 'A descrição é obrigatória.'},
    length: {
      minimum: 10,
      maximum: 300,
      message: 'A descrição deve conter no mínimo 10 e no máximo 300 caracteres.'
    }
  },
  course: {
    presence: { allowEmpty: false, message: 'O curso é obrigatório.' },
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      message: 'Escolha um curso.',
    }
  }
};

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = props => {
  const { className, history, ...rest } = props;
  const [courses, setCourses] = useState([{'id': '0', 'description': '- Escolha um curso -'}]);
  const { codigoProfile } = props.match.params;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  //configuration alert
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  function loadAlert(icon, message) {
    Toast.fire({
      icon: icon,
      title: message
    });
  }

  async function loadCourses(){
    try {
      const response = await api.get('all/courses');
      if(response.status == 200){
        setCourses([...courses, ...response.data]);
      }
    } catch (error) {

    }
  }

  async function saveProfileDetails(){
    try {
      const fk_course_id = formState.values.course;
      const description = formState.values.description;
      const id = formState.values.id;
      const data = {
        description, fk_course_id
      }
      let response= {};
      let acao = "";
      if(!id) {
         response = await api.post('profile', data);
        acao = "cadastrado";
      } else {
         response = await api.put('profile/'+id, data);
        acao = "atualizado";
      }
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        } else if(response.data.errors[0].description){
          loadAlert('error', response.data.errors[0].description);
        } if(response.data.errors[0].fk_course_id){
          loadAlert('error', response.data.errors[0].fk_course_id);
        }
      } else {
        loadAlert('success', 'Perfil '+acao+'.');
        history.push('/profiles');
      }

    } catch (error) {

    }
  }

  async function findAProfile(id){
    try {
      const response = await api.get('profile/show/'+id);
      if (response.status === 202) {
        if(response.data.message){
          loadAlert('error', response.data.message);
        }
      } else {
        setFormState(formState => ({
          values: {
            'description': response.data[0].description,
            'course' : response.data[0].fk_course_id,
            'id': response.data[0].id
          },
          touched: {
            ...formState.touched,
          }
        }));
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    loadCourses();

    if(codigoProfile){
      findAProfile(codigoProfile);
    }

  }, []);

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: (errors || formState.values.course==0) ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    setFormState({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    });
  };

  const hasError = field =>
      formState.touched[field] && formState.errors[field] ? true : false;

  const handleBack = () => {
    history.goBack();
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}>
      <form
        autoComplete="off"
        onSubmit={saveProfileDetails}>
        <div className={classes.contentHeader}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
        </div>
        <CardHeader
          subheader=""
          title="Perfil"/>
        <Divider />
        <CardContent>
          <Grid
              container
              spacing={3}>
            <Grid
              item
              md={6}
              xs={12}>
              <TextField
                fullWidth
                error={hasError('description')}
                helperText={
                  hasError('description') ? formState.errors.description[0] : null
                }
                label="Descrição"
                margin="dense"
                name="description"
                onChange={handleChange}
                value={formState.values.description || ''}
                variant="outlined"
              />
            </Grid>
          <Grid
              item
              md={6}
              xs={12}>
            <TextField
                fullWidth
                error={hasError('course')}
                helperText={
                  hasError('course') ? formState.errors.course[0] : null
                }
                label=""
                margin="dense"
                name="course"
                onChange={handleChange}
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={formState.values.course}
                variant="outlined">
              {courses.map(course => (
                  <option
                      key={course.id}
                      value={course.id}>
                    {course.description}
                  </option>
              ))}
            </TextField>
          </Grid>
          </Grid>
        </CardContent>

        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={saveProfileDetails}
            disabled={!formState.isValid}>
            Salvar
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string,
};

export default ProfileDetails;
