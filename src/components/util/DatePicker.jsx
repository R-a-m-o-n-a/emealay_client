import React from 'react';
import { DatePicker as MuiDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import deLocale from "date-fns/locale/de";
import frLocale from "date-fns/locale/fr";
import itLocale from "date-fns/locale/it";
import enGBLocale from "date-fns/locale/en-GB";
import enUSLocale from "date-fns/locale/en-US";
import esLocale from "date-fns/locale/es";
import jaLocale from "date-fns/locale/ja";
import { useTranslation } from "react-i18next";
import { func, string } from "prop-types";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  dateSelection: {
    marginTop: '.5em',
    marginBottom: '.5em',
    marginLeft: 'auto',
    maxWidth: '125px',
  },
}));

const localeMap = {
  de: deLocale,
  it: itLocale,
  ja: jaLocale,
  fr_FR: frLocale,
  en_GB: enGBLocale,
  en_US: enUSLocale,
  es: esLocale,
};

// these are taken from Plans.jsx: Date(plan.date).toLocaleDateString(t('DATE_LOCALE'))
const localeFormatMap = {
  de: "d.M.yyyy",
  it: "d/M/yyyy",
  ja: "yyyy/M/d",
  fr_FR: "dd/MM/yyyy",
  en_GB: "dd/MM/yyyy",
  en_US: "M/d/yyyy",
  es: "d/M/yyyy",
};

/** This is a wrapper the Outlined TextField that is used mostly throughout the app.
 * It bundles common attributes and styles.
 * Any other Attributes for a MUI TextField are passed through to the actual component */
const DatePicker = (props) => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  const { onChange, ...otherProps } = props;

  console.log(props);

  const handleInputChange = (date) => {
    console.log(date);
    onChange(date);
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap[i18n.language]}>
      <MuiDatePicker autoOk
                          className={classes.dateSelection}
                          disableToolbar
                          variant="dialog" // dialog or inline
                          inputVariant="outlined"
                          format={localeFormatMap[i18n.language]}
                          onChange={date => handleInputChange(date)}
                          cancelLabel={t('Cancel')}
                          KeyboardButtonProps={{
                            size: 'small',
                          }}
                          {...otherProps} />
    </MuiPickersUtilsProvider>
  );
}

DatePicker.propTypes = {
  /**  */
  value: string.isRequired,
  onChange: func.isRequired,
  label: string.isRequired,
}

DatePicker.defaultProps = {}

export default DatePicker;
