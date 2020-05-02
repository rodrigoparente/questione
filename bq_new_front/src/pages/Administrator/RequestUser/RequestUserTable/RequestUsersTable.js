import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination, Button, Tooltip
} from '@material-ui/core';
import api from '../../../../services/api';
import { StatusBullet } from '../../../../components';
import Swal from "sweetalert2";
import RequestUsersToolbar from "./components/RequestUsersToolbar";
import Edit from "@material-ui/icons/Edit";
import PropTypes from "prop-types";

const statusColors = {
  '1': 'success',
  '0': 'info',
  '-1': 'danger'
};
const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  content: {
    padding: 0,
    marginTop: theme.spacing(2)
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  headTable: {
    fontWeight: "bold"
  },
  actions: {
    justifyContent: 'flex-end'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  status: {
    marginRight: theme.spacing(1)
  },
}));

const RequestUsersTable = props => {
  const { className, history } = props;

  const [couserProfessor, setCourseProfessor] = useState([]);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState(0);

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

  async function loadCourseProfessor(page, situation){
    try {
      let url = 'course-professor?page='+page+'&valid='+situation;
      const response = await api.get(url);
      setTotal(response.data.total);
      setCourseProfessor(response.data.data);
      console.log(response.data);
    } catch (error) {
      loadAlert('error', 'Erro de conexão.');
    }
  }

  useEffect(() => {
    loadCourseProfessor(1, searchText);
  }, []);

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    setPage(0);
    loadCourseProfessor(1, searchText);
  }

  const handlePageChange = (event, page) => {
    loadCourseProfessor(page+1, searchText)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const onClickEdit = (id) => {
    history.push('/users/requests/'+id);
  }

  return (
    <div className={classes.root}>
      <RequestUsersToolbar
          onChangeSearch={updateSearch.bind(this)}
          searchText={searchText}
          onClickSearch={onClickSearch}/>
      <div className={classes.content}>
        <Card
            className={clsx(classes.root, className)}>
          <CardContent className={classes.content}>
            <PerfectScrollbar>
              <div className={classes.inner}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.headTable}>Nome</TableCell>
                      <TableCell className={classes.headTable}>Email</TableCell>
                      <TableCell className={classes.headTable}>Curso Solicitado</TableCell>
                      <TableCell className={classes.headTable}>Situação</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {couserProfessor.map(cp => (
                        <TableRow
                            className={classes.tableRow}
                            hover
                            key={cp.id}>
                          <TableCell>{cp.user.name}</TableCell>
                          <TableCell>{cp.user.email}</TableCell>
                          <TableCell>{cp.course.description}</TableCell>
                          <TableCell className={classes.row}>
                            <div className={classes.statusContainer}>
                              <StatusBullet
                                  className={classes.status}
                                  color={statusColors[cp.valid]}
                                  size="sm"
                              />
                              {cp.valid == 1 ? 'Aceito' :
                                  cp.valid == -1 ? 'Recusado' : 'Aguardando'}
                            </div>
                            <Tooltip title="Editar">
                              <Button
                                  className={classes.buttonEdit}
                                  onClick={() => onClickEdit(cp.id)}>
                                <Edit fontSize="medium"/>
                              </Button>
                            </Tooltip>
                          </TableCell>

                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </PerfectScrollbar>
          </CardContent>
          <CardActions className={classes.actions}>
            <TablePagination
                component="div"
                count={total}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10]}
            />
          </CardActions>
        </Card>
      </div>
    </div>
  );
};

RequestUsersTable.propTypes = {
  history: PropTypes.object
};

export default RequestUsersTable;
