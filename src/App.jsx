// import './App.css'
import { useCallback, useEffect, useRef, useState,  } from "react";
import Modal from "./Components/Modal";
import logoImg from "./assets/logo.png";
import Places from "./Components/Place";
import { AVAILABLE_PLACES } from "./Components/Data";
import DeleteConfirmation from "./Components/DeleteConfirmation";
import { sortPlacesByDistance } from "./Components/loc";

const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const storedPlaces = storedIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
  const selectedPlace = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

  // useEffect (()=> {
  //  const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
  //  const storedPlaces = storedIds.map(id => AVAILABLE_PLACES.find((place)=>place.id === id)
  // );

  // setPickedPlaces(storedPlaces);
  // },[])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );

      setAvailablePlaces(sortedPlaces);
    }); //side effect
  }, []);

  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedIdS = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    if (storedIdS.indexOf(id) === -1)
      localStorage.setItem("selectedPlaces", JSON.stringify([]));
  }

  // console.log(pickedPlaces)

  const handleRemovePlace = useCallback (
    function handleRemovePlace() {
      setPickedPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
      );
        
  
      const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
      );
    },[]  
  )
  return (
    <>
      <Modal open={modalIsOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
