// src/components/HootForm/HootForm.jsx

import styles from './HootForm.module.css'
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as hootService from "../../services/hootService"

const HootForm = (props) => {
  const { hootId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    category: "News",
  });

  useEffect(() => {
    const fetchHoot = async () => {
      const hoot = await hootService.show(hootId)
      setFormData(hoot)
    }
    if (hootId) fetchHoot()
  }, [hootId])

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (hootId) {
      props.handleUpdateHoot(hootId, formData)
    }
    else {
      props.handleAddHoot(formData);
    }
  };

  return (
    <main className={styles.container}>
      <form onSubmit={handleSubmit}>
        <h1>{ hootId ? "Edit Hoot" : "Create Hoot" }</h1>
        <label htmlFor="title-input">Title</label>
        <input
          required
          type="text"
          name="title"
          id="title-input"
          value={formData.title}
          onChange={handleChange}
        />
        <label htmlFor="text-input">Text</label>
        <textarea
          required
          type="text"
          name="text"
          id="text-input"
          value={formData.text}
          onChange={handleChange}
        />
        <label htmlFor="category-input">Category</label>
        <select
          required
          name="category"
          id="category-input"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="News">News</option>
          <option value="Games">Games</option>
          <option value="Music">Music</option>
          <option value="Movies">Movies</option>
          <option value="Sports">Sports</option>
          <option value="Television">Television</option>
        </select>
        <button type="submit">SUBMIT</button>
      </form>
    </main>
  );
};

export default HootForm;
