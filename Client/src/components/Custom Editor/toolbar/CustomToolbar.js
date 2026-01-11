import React from "react";

export default function CustomToolbar() {
  return (
    <div id="toolbar">
      <select className="ql-header" defaultValue={""} onChange={(e) => e.persist()}>
        <option value="1" />
        <option value="2" />
        <option value="" />
      </select>
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-link" />
      <button className="ql-image" />
      <button className="ql-code-block" />
    </div>
  );
}




