import { configureStore } from '@reduxjs/toolkit'
import variableGroup from './variableList.js'
export default configureStore({
    reducer: {
      variable_Group: variableGroup,    
      //infoGroup: infoList,
    },
  })