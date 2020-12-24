import React from 'react';
export const Form = ({ onSubmit }) => {
return (
<form onSubmit={onSubmit}>
  <div className="form-group">
      <label htmlFor="name">Zip Code</label>
    <input className="form-control" id="name" />
  </div> 
  
  <div className="form-group">
    <label htmlFor="email">Email Address</label>
    <input type="email" className="form-control" id="email"
     placeholder="name@example.com" 
    />
</div>
  <div className="form-group">
    <button className="form-control btn btn-primary" type="submit">
      Subscribe
    </button>
</div>
</form>
);
};
export default Form;