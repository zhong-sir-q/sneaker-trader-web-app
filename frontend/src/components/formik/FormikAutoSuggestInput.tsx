import React, { useState } from 'react';
import { Input, ListGroup, ListGroupItem, InputProps } from 'reactstrap';
import OutsideClickHandler from '../OutsideClickHandler';
import { useField, FieldHookConfig } from 'formik';
import styled from 'styled-components';

type FormikAutoSuggestInputProps = {
  label: string;
  options: string[];
  setfieldvalue: (field: string, value: any) => void;
} & FieldHookConfig<string>;

const StyledListGroup = styled(ListGroup)`
  position: absolute;
  margin-top: 2px;
  z-index: 1;
  max-height: 350px;
  overflow: auto;
`;

const FormikAutoSuggestInput = (props: FormikAutoSuggestInputProps) => {
  const { options, setfieldvalue, ...inputProps } = props;

  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(0);

  const [field, meta] = useField(props);

  const filter = (val: string) => options.filter((opt) => opt.toLowerCase().indexOf(val.toLowerCase()) > -1);

  const onInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(evt);

    const { value } = evt.target;

    if (value === '') {
      setShowSuggestions(false);
      setFilteredSuggestions(options);
    } else {
      setShowSuggestions(true);
      setFilteredSuggestions(filter(value));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setActiveSuggestionIdx(0);
      setShowSuggestions(false);
      if (activeSuggestionIdx < filteredSuggestions.length)
        setfieldvalue(props.name, filteredSuggestions[activeSuggestionIdx]);
    } else if (e.key === 'ArrowUp') {
      if (activeSuggestionIdx === 0) return;
      setActiveSuggestionIdx(activeSuggestionIdx - 1);
    } else if (e.key === 'ArrowDown') {
      if (activeSuggestionIdx === filteredSuggestions.length - 1) return;
      setActiveSuggestionIdx(activeSuggestionIdx + 1);
    } else if (e.key === 'Tab') setShowSuggestions(false);
  };

  const onClickSuggestion = (e: React.MouseEvent<any, MouseEvent>) => {
    setActiveSuggestionIdx(0);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setfieldvalue(props.name, e.currentTarget.innerText);
  };

  const SuggestionsList = () => {
    if (showSuggestions && field.value) {
      const listItems =
        filteredSuggestions.length === 0 ? (
          <ListGroupItem>No suggestions</ListGroupItem>
        ) : (
          filteredSuggestions.map((opt, idx) => (
            <ListGroupItem
              active={activeSuggestionIdx === idx}
              onClick={onClickSuggestion}
              tag='button'
              action
              key={idx}
            >
              {opt}
            </ListGroupItem>
          ))
        );

      return (
        <OutsideClickHandler handler={() => setShowSuggestions(false)}>
          <StyledListGroup>{listItems}</StyledListGroup>
        </OutsideClickHandler>
      );
    }

    return null;
  };

  return (
    <React.Fragment>
      {props.label && <label>{props.label}</label>}
      <Input
        {...field}
        {...(inputProps as InputProps)}
        type='text'
        onFocus={() => setShowSuggestions(true)}
        placeholder={props.label}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
      />
      <SuggestionsList />
      {meta.touched && meta.error && (
        <span className='category' style={{ color: 'red', marginLeft: '10px', marginTop: '10px' }}>
          {meta.error}
        </span>
      )}
    </React.Fragment>
  );
};

export default FormikAutoSuggestInput;
