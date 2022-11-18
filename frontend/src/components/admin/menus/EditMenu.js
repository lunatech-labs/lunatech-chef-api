import React from "react";
import { Form, Field } from "react-final-form";
import { useNavigate, useLocation } from "react-router-dom";

export function EditMenu(props) {
  const required = (value) => (value ? undefined : "Required");

  const menu = useLocation().state;

  const navigate = useNavigate();
  const onSubmit = (values) => {
    let editedMenu = {
      ...values,
      uuid: menu.uuid,
    };
    props.editMenu(editedMenu);
    navigate("/allmenus");
  };

  function ShowError({ error }) {
    if (error) {
      return (
        <div>
          <h4>An error ocurred when editing a Menu: {error}</h4>
        </div>
      );
    } else {
      return <div></div>;
    }
  }

  function RenderData() {
    return (
      <Form
        onSubmit={onSubmit}
        initialValues={{
          name: menu.name,
          dishesUuids: menu.dishes.map((dish) => dish.uuid),
        }}
        render={({ handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <Field validate={required} name="name">
                {({ input, meta }) => (
                  <div>
                    <label>Name</label>
                    <input {...input} type="text" placeholder="Name" />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </div>
                )}
              </Field>
            </div>
            {props.dishes.map((dish, index, arr) => {
              return (
                <div>
                  <Field
                    name="dishesUuids"
                    component="input"
                    type="checkbox"
                    value={dish.uuid}
                  ></Field>
                  <label>{dish.name}</label>
                </div>
              );
            })}

            <div>
              <button type="submit" color="primary" disabled={submitting}>
                Save Menu
              </button>
            </div>
          </form>
        )}
      ></Form>
    );
  }

  return (
    <div className="container">
      <div>
        <h3 className="mt-4">Editing Menu</h3>
      </div>
      <RenderData />
      <ShowError error={props.error} />
    </div>
  );
};
