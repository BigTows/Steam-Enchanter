import React from "react";
import renderer from "react-test-renderer";
import Pagination from "../../ui/react/component/ui/Pagination";

test("pagination with difference setup", () => {

  const callback = () => {

  };

  let component = renderer.create(
    <Pagination items={55} itemsPerPage={10} currentPage={1} callback={callback} />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();


  component = renderer.create(
    <Pagination items={10} itemsPerPage={10} currentPage={1} callback={callback} />
  );
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();


  component = renderer.create(
    <Pagination items={9000} itemsPerPage={44} currentPage={15} callback={callback} />
  );
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  component = renderer.create(
    <Pagination items={100} itemsPerPage={10} currentPage={10} callback={callback} />
  );
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  component = renderer.create(
    <Pagination items={100} itemsPerPage={10} currentPage={9} callback={callback} />
  );
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();


  component = renderer.create(
    <Pagination items={900909} itemsPerPage={10} currentPage={4} callback={callback} />
  );
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});