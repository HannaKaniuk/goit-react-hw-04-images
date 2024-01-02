import React, { useEffect, useState } from 'react';
import { fetchImages } from './services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import css from './App.module.css';
import { Button } from './Button/Button';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';

export const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [theEndOfImages, setTheEndOfImages] = useState(false);

  useEffect(() => {
    if (!query) return;
    const fetchData = async () => {
      try {
        setShowLoader(true);
        const allImages = await fetchImages(query, page);

        if (allImages.hits.length === 0) {
          toast.info('Sorry, there are no images matching your search query.');
          return;
        }

        setImages(prevImages => [...prevImages, ...allImages.hits]);

        const totalPages = Math.ceil(allImages.totalHits / 12);

        if (page === totalPages) {
          setTheEndOfImages(true);
          toast.info(
            'Sorry, there are no more images matching your search query.'
          );
        }
      } catch (error) {
        toast.error('An error occurred while fetching images.');
        console.error(error);
      } finally {
        setShowLoader(false);
      }
    };

    fetchData();
  }, [query, page]);

  const openModal = (largeImageURL, tags) => {
    setModalData({ largeImageURL, tags });
  };

  const closeModal = () => {
    setModalData(null);
  };

  const handleSearchFormSubmit = newQuery => {
    setQuery(newQuery);
    setPage(1);
    setImages([]);
  };

  const loadMoreClick = () => {
    setPage(prevPage => prevPage + 1);
  };

  const showLoadMoreBtn = images.length > 0 && !theEndOfImages;

  return (
    <div className={css.app}>
      <Searchbar onSubmitForm={handleSearchFormSubmit} />
      <ImageGallery images={images} onModalClick={openModal} />
      {modalData && (
        <Modal
          largeImageURL={modalData.largeImageURL}
          onCloseModal={closeModal}
          tags={modalData.tags}
        />
      )}
      {showLoadMoreBtn && <Button onLoadMoreClick={loadMoreClick} />}
      {showLoader && <Loader />}
      <ToastContainer autoClose={3000} />
    </div>
  );
};
