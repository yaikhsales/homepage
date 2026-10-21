import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder=TextEncoder; global.TextDecoder=TextDecoder;
const { MemoryRouter } = require('react-router-dom');
const TlYhrHub = require('./TlYhrHub').default;
jest.mock('../chatbot/bot-modules',()=>()=> <div>HR assistant</div>);
HTMLDialogElement.prototype.showModal = function(){this.setAttribute('open','');};
const mount=(query='')=>render(<MemoryRouter initialEntries={['/dashboard/yhr'+query]}><TlYhrHub/></MemoryRouter>);

test('protected groups stop at the password dialog and discard entered passwords',()=>{
 mount('?mode=admin&group=attendance');
 fireEvent.click(screen.getByRole('button',{name:'People Management'}));
 expect(screen.getByRole('dialog')).toBeVisible();
 const password=screen.getByLabelText('Global Password');
 fireEvent.change(password,{target:{value:'test-only-not-a-real-password'}});
 fireEvent.click(screen.getByRole('button',{name:'Unlock'}));
 expect(screen.getByRole('status')).toHaveTextContent('preview stops at the password prompt');
 expect(password).toHaveValue('');
 fireEvent.click(screen.getByRole('button',{name:'Cancel'}));
 expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
 expect(screen.getByRole('link',{name:/Attendance Hub/})).toBeVisible();
});

test('a direct protected URL does not expose protected content',()=>{
 mount('?mode=admin&group=payroll');
 expect(screen.getByRole('dialog')).toHaveTextContent('Payroll & Finance');
 fireEvent.click(screen.getByRole('button',{name:'Cancel'}));
 expect(screen.getByRole('button',{name:'Time & Attendance'})).toHaveAttribute('aria-pressed','true');
});

test('My Team can return to services and Smart PaySlip stops at setup',()=>{
 mount('?mode=services');
 fireEvent.click(screen.getByRole('button',{name:/My Team Manage Team Actions/}));
 fireEvent.click(screen.getByRole('button',{name:'Team Operations'}));
 expect(screen.getByRole('link',{name:/Team Attendance/})).toHaveAttribute('href','https://tl.yaikh.com/dashboard/yhr/view_attendance');
 fireEvent.click(screen.getByRole('button',{name:'Back to My Services'}));
 fireEvent.click(screen.getByRole('button',{name:/Smart PaySlip/}));
 expect(screen.getByRole('dialog')).toHaveTextContent('Create Security Password');
 expect(screen.getByLabelText('Confirm Password')).toHaveAttribute('type','password');
});

test('month navigation changes the period rather than reusing current sample values',()=>{
 mount('?month=2001-01');
 expect(screen.queryByText('160h 00m')).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:'Previous month'}));
 expect(screen.getByLabelText('Attendance month')).toHaveValue('2000-12');
});
