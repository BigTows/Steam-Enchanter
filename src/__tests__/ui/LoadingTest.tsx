import renderer from "react-test-renderer";
import React from "react";
import Loading from "../../ui/react/component/ui/Loading";

test("Loading component test", () => {
  let component = renderer.create(
    <Loading />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});