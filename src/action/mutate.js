// @flow
import {Map, List} from 'immutable';
import type {Action, ActionType} from './types';

export default function mutate(originValue: Map<string, *>, action: Action<ActionType>): any {
  const {key, id, value, path} = action.payload;
  switch (action.type) {
    case 'CREATE_ARRAY': {
      return originValue.update(key, list => list.push(value));
    }
    case 'UPDATE_ARRAY': {
      return originValue.update(key, list => list.map(item => item.get('id') === id ? item.merge(value): item));
    }
    
    case 'DELETE_ARRAY': {
      return originValue.update(key, list => list.filter(item => item.get('id') !== id));
    }

    case 'UPDATE_OBJECT': {
      return originValue.update(key, map => map.merge(value));
    }

    case 'CONNECT': {
      const index = (originValue.get(key) || new List()).findIndex(item => item.get('id') === id);
      return originValue.updateIn([key, index, path], list => list.push(value));
    }

    case 'DISCONNECT': {
      const index = (originValue.get(key) || new List()).findIndex(item => item.get('id') === id);
      return originValue.updateIn([key, index, path], list => list.filter(item => item.get('id') !== value.get('id')));
    }

    case 'CREATE_AND_CONNECT': {
      const index = (originValue.get(key) || new List()).findIndex(item => item.get('id') === id);
      return originValue.updateIn([key, index, path], list => list.push(value));
    }

    case 'DISCONNECT_AND_DELETE': {
      const index = (originValue.get(key) || new List()).findIndex(item => item.get('id') === id);
      return originValue.updateIn([key, index, path], list => list.filter(item => item.get('id') !== value.get('id')));
    }

    case 'NOOP':
    default:
      return originValue;
  }
}