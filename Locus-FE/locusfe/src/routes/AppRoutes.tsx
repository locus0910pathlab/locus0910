import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../modules/Dashboard/Dashboard';
import Patients from '../modules/Patients/Patients';
import AddPatient from '../modules/AddPatient/AddPatient';
import PatientDetails from '../modules/PatientDetails/PatientDetails';
import CreateAppointment from '../modules/CreateAppointment/CreateAppointment';
import Appointments from '../modules/Appointments/Appointments';
import TestList from '../modules/TestList/TestList';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/patients" element={<Patients />} />
      <Route path="/patients/new" element={<AddPatient />} />
      <Route path="/patients/:id" element={<PatientDetails />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/appointments/new" element={<CreateAppointment />} />
      <Route path="/appointments/edit/:id" element={<CreateAppointment />} />
      <Route path="/tests" element={<TestList />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
