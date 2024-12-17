import styles from "./HootDetails.module.css";

import AuthorInfo from "../../components/AuthorInfo/AuthorInfo";

import Icon from "../Icon/Icon";
import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthedUserContext } from "../../App";
import CommentForm from "../CommentForm/CommentForm";
import Loading from "../Loading/Loading";
import * as hootService from "../../services/hootService";

const HootDetails = (props) => {
  const user = useContext(AuthedUserContext);
  const { hootId } = useParams();
  const [hoot, setHoot] = useState();

  useEffect(() => {
    const fetchHoot = async () => {
      const hoot = await hootService.show(hootId);
      setHoot(hoot);
    };
    fetchHoot();
  }, [hootId]);

  const handleAddComment = async (commentFormData) => {
    const newComment = await hootService.createComment(hootId, commentFormData);
    setHoot({ ...hoot, comments: [...hoot.comments, newComment] });
  };

  const handleDeleteComment = async (hootId, commentId) => {
    // Eventually the service function will be called upon here
    const delComment = await hootService.deleteComment(hootId, commentId);
    setHoot({
      ...hoot,
      comments: hoot.comments.filter((comment) => comment._id !== commentId),
    });
  };

  return (
    <>
      {!hoot ? (
        <Loading />
      ) : (
        <main className={styles.container}>
          <section>
            <header>
              <p>{hoot.category.toUpperCase()}</p>
              <h1>{hoot.title}</h1>
              <AuthorInfo content={hoot} />
              {hoot.author._id === user._id && (
                <>
                  <Link to={`/hoots/${hootId}/edit`}>
                    <Icon category="Edit" />
                  </Link>
                  <button
                    onClick={() => {
                      props.handleDeleteHoot(hootId);
                    }}
                  >
                    <Icon category="Trash" />
                  </button>
                </>
              )}
            </header>
            <p>{hoot.text}</p>
          </section>
          <section>
            <h2>Comments</h2>
            <CommentForm handleAddComment={handleAddComment} />
            {!hoot.comments.length && <p>There are no comments.</p>}

            {hoot.comments.map((comment) => (
              <article key={comment._id}>
                <header>
                  <div>
                    <AuthorInfo content={hoot} />
                    {comment.author._id === user._id && (
                      <>
                        <Link
                          to={`/hoots/${hootId}/comments/${comment._id}/edit`}
                        >
                          <Icon category="Edit" />
                        </Link>
                        <button
                          onClick={() =>
                            handleDeleteComment(hootId, comment._id)
                          }
                        >
                          <Icon category="Trash" />
                        </button>
                      </>
                    )}
                  </div>
                </header>
                <p>{comment.text}</p>
              </article>
            ))}
          </section>
        </main>
      )}
    </>
  );
};

export default HootDetails;
