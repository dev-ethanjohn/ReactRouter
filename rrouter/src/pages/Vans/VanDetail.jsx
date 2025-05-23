import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

export default function VanDetail() {
  const params = useParams();
  const location = useLocation();
  console.log(params); // Should log: { id: "some-id" }
  const [van, setVan] = useState(null);

  useEffect(() => {
    async function getDetailView() {
      try {
        const response = await fetch(`/api/vans/${params.id}`);
        const data = await response.json();
        console.log(data);
        setVan(data.vans);
      } catch (error) {
        console.error("Failed to fetch van details:", error);
      }
    }

    getDetailView();
  }, [params.id]);

  const search = location.state?.search || "";
  const type = location.state?.type || "all";

  return (
    <div className="van-detail-container">
      <Link to={`..${search}`} relative="path" className="back-button">
        &larr; <span>Back to {type} vans</span>
      </Link>
      {van ? (
        <div className="van-detail">
          <img src={van.imageUrl} />
          <i className={`van-type ${van.type} selected`}>{van.type}</i>
          <h2>{van.name}</h2>
          <p className="van-price">
            <span>${van.price}</span>/day
          </p>
          <p>{van.description}</p>
          <button className="link-button">Rent this van</button>
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
}
