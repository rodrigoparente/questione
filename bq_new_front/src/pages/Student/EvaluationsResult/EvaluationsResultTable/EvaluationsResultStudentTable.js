import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  IconButton,
  Typography, Table, TableBody, CardActions, TablePagination, Tooltip, Switch, Chip, Grid
} from '@material-ui/core';
import api from "../../../../services/api";
import ToolbarEvaluation
  from "./EvaluationResultToolbar/EvaluationResultStudentToolbar";
import moment from "moment";
import {FormatListBulleted} from "@material-ui/icons";

const useStyles = makeStyles(() => ({
  root: {
    margin: 10,
  },
  content: {
    padding: 0
  },


}));

const EvaluationsResultStudentTable = props => {
  const { className, history, ...rest } = props;
  const [ evaluations, setEvaluations ] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');

  const classes = useStyles();

  async function load(){
    try {
      const responseHead = await api.get('/evaluation/student/result/evaluations');
      if (responseHead.status === 200) {
        setEvaluations(responseHead.data.data);
        setTotal(responseHead.data.total);
      }

    } catch (error) {

    }
  }

  useEffect(() => {
    load();

  }, []);

  const handleBack = () => {
    history.goBack();
  };

  const handlePageChange = (event, page) => {
    load(page+1)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const updateSearch = (e) => {
    setSearchText(e.target.value);
  }

  const onClickSearch = (e) => {
    setPage(0);
    load(1);
  }

  const results = (idHead) => {
    history.push('/student/result-evaluations/details/'+idHead);
  }

  return (
      <div className={classes.root}>
        <ToolbarEvaluation
            onChangeSearch={updateSearch.bind(this)}
            searchText={searchText}
            onClickSearch={onClickSearch}/>
        <div className={classes.content}>
          <Card
              className={clsx(classes.root, className)}>
            <CardHeader
                avatar={
                  <div>


                  </div>
                }
                action={
                  <TablePagination
                      component="div"
                      count={total}
                      onChangePage={handlePageChange}
                      onChangeRowsPerPage={handleRowsPerPageChange}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      rowsPerPageOptions={[10]}
                  />

                }/>
            <CardContent>
              <Grid
                  container
                  spacing={1}>
                <Grid
                    item
                    md={12}
                    xs={12}>
                  <Table>
                    <TableBody>
                      {evaluations.map(application => (
                          <Card
                              {...rest}
                              className={classes.root}>
                            <CardHeader
                                className={classes.head}
                                avatar={
                                  <div>
                                    <Typography variant="h5" color="textSecondary" component="h2">
                                      {'Descrição da avaliação: '+application.evaluation_application.evaluation.description }
                                    </Typography>
                                    <Typography variant="h5" color="textSecondary" component="h2">
                                      {'Descrição da aplicação: '+application.evaluation_application.description }
                                    </Typography>
                                    <Typography variant="h5" color="textSecondary" component="h2">
                                      {'Professor(a): '+application.evaluation_application.evaluation.user.name }
                                    </Typography>

                                  </div>
                                }
                                action={
                                  <div>
                                    { application.evaluation_application.show_results == 1 ?
                                    <Tooltip title="Visualizar resultados">
                                      <IconButton
                                          aria-label="copy"
                                          onClick={() => results(application.id)}>
                                        <FormatListBulleted/>
                                      </IconButton>
                                    </Tooltip>
                                      :
                                        <Typography variant="h5" color="textSecondary" component="h2">
                                          {'Resultado não liberado.' }
                                        </Typography>
                                    }
                                  </div>
                                }/>
                          </Card>
                      ))}
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
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

EvaluationsResultStudentTable.propTypes = {
  className: PropTypes.string,
};

export default EvaluationsResultStudentTable;
