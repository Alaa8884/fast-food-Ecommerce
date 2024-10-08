import { useCallback, useEffect, useMemo, useState } from "react";
import ReactPaginate from "react-paginate";
import debounce from "lodash.debounce";
import { Col, Container, Row } from "reactstrap";
import Helmet from "../components/helmet/Helmet";
import CommonSection from "../components/Ui/common-section/CommonSection";
import allFoodsData from "../assets/data/foodsData";
import ProductCard from "../components/Ui/product-card/ProductCard";
import "../styles/all-foods.css";
import "../styles/paginate-page.css";


function AllFood() {
  const [searchItem, setSearchItem] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [sortedBy, setSortedBy] = useState("default");
  
  function handleChange(e) {
    setSearchItem(e.target.value);
  }

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 700);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults(searchItem);
      debouncedResults.cancel();
    };
  }, [debouncedResults, searchItem]);

  const searchedFood = allFoodsData.filter((food) => {
    if (searchItem === "") return food;
    if (food.title.toLowerCase().includes(searchItem.toLowerCase()))
      return food;
  });

  const productPerPage = 10;
  const visitedPage = pageNumber * productPerPage;
  const displayPage = searchedFood.slice(
    visitedPage,
    visitedPage + productPerPage
  );
  const pageCount = Math.ceil(searchedFood.length / productPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const displayPageLenght = displayPage.length > 0;

  const sorted = useCallback(() => {
    if (sortedBy === "default") return;

    displayPage.sort((a, b) => {
      if (sortedBy === "ascending") {
        return a.title.localeCompare(b.title); 
      } else if (sortedBy === "descending") {
        return b.title.localeCompare(a.title);
      } else if (sortedBy === "low-price") {
        return a.price - b.price;
      } else if (sortedBy === "high-price") {
        return b.price - a.price;
      } 
    });
  }, [sortedBy, displayPage]);

  sorted()

  const handleSortChange = (e) => {
    setSortedBy(e.target.value);
  
  };

  return (
    <Helmet title="All Foods">
      <CommonSection title="All Foods" />
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="6" xs="12" className="mb-4">
              <div className="search-box d-flex align-items-center justify-content-between ">
                <input
                  className="w-75"
                  type="text"
                  name="search-text"
                  placeholder="I'm looking for..."
                  onChange={debouncedResults}
                  id="search-result"
                />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div>
            </Col>
            <Col lg="6" md="6" sm="6" xs="12" className="text-end mb-4">
              <div className="sorting-box">
                <select value={sortedBy} onChange={handleSortChange}>
                  <option value="default">Default</option>
                  <option value="ascending">Sort by name (A - Z)</option>
                  <option value="descending">Sort by name (Z - A)</option>
                  <option value="low-price">Sort by price (Low first)</option>
                  <option value="high-price">Sort by price (High first)</option>
                </select>
              </div>
            </Col>
            {displayPageLenght ? (
              displayPage.map((food) => (
                <Col
                  lg="3"
                  md="4"
                  sm="6"
                  xs="6"
                  key={food.id}
                  className="mt-5"
                >
                  <ProductCard food={food} />
                </Col>
              ))
            ) : (
              <Col
                lg="12"
                md="12"
                sm="12"
                xs="12"
                className="w-100 text-center"
              >
                <p className="not-found-msg">
                  No results found, please try again
                </p>
              </Col>
            )}
            {displayPageLenght ? (
              <div>
                <ReactPaginate
                  pageCount={pageCount}
                  onPageChange={changePage}
                  previousLabel="Prev"
                  nextLabel="Next"
                  containerClassName="pagination-btns"
                />
              </div>
            ) : (
              ""
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
}

export default AllFood;
