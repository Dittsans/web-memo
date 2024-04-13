import Head from 'next/head';
import React, { Component } from 'react';
import { getSiswaForHome, getSiswa, getAllGaleri, getGaleri } from '../lib/siswa';
import { withRouter } from 'next/router';

export async function getServerSideProps({ query: {absen, page= 1, galeri} }) {
  const countSiswa = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/siswas/count`);
  const resCount = await countSiswa.json();
  const lastPage = Math.ceil(resCount / 6);
  const limit = +page === 1 ? 6 : +page * 6;
  const siswaData = await getSiswaForHome(limit);

  const galeriData = await getAllGaleri();

  if(!absen && !galeri){
    return {
      props: {
        siswa: siswaData,
        galeri: galeriData,
        page: +page,
        lastPage: lastPage
      }
    }
  }else if(galeri){
    const modalGaleri = await getGaleri(galeri);
    return {
      props: {
        siswa: siswaData,
        modalGaleri: modalGaleri,
        galeri: galeriData,
        page: +page,
        lastPage: lastPage
      }
    }
  }else if(absen) {
    const modalSiswa = await getSiswa(absen);
    return {
      props: {
        siswa: siswaData,
        modalSiswa: modalSiswa,
        galeri: galeriData,
        page: +page,
        lastPage: lastPage
      }
    }
  }
}

class Home extends Component {

  componentDidMount () {
    let htmlClasses = document.querySelector('body').classList;
    let sun = document.querySelector('#sun').classList;
    let moon = document.querySelector('#moon').classList;

    document.getElementById('switchTheme').addEventListener('click', function() {
      if(localStorage.getItem('theme') === 'dark') {
        htmlClasses.remove('dark');
        localStorage.removeItem('theme');
        sun.add('hidden');
        moon.remove('hidden');
        document.querySelector('.toggleCircle').removeAttribute('style','transform: translateX(100%)');
        document.querySelector('.togglePath').removeAttribute('style','background-color: #374151');
      } else {
        htmlClasses.add('dark');
        localStorage.setItem('theme', 'dark');
        sun.remove('hidden');
        moon.add('hidden');
        document.querySelector('.toggleCircle').setAttribute('style','transform: translateX(100%)');
        document.querySelector('.togglePath').setAttribute('style','background-color: #374151');
      }
    });

    if(localStorage.getItem('theme') === 'dark'){
      htmlClasses.add('dark');
      sun.remove('hidden');
      moon.add('hidden');
      document.querySelector('.toggleCircle').setAttribute('style','transform: translateX(100%)');
      document.querySelector('.togglePath').setAttribute('style','background-color: #374151');
    };

  }

  constructor(props) {
    super(props);
    this.state = {
      showModalSiswa: false,
      showModalGaleri: false
    };
  }

  onClickSiswa = (absen) => {
    this.props.router.push(`?page=${this.props.page}&absen=${absen}`,'/');
    this.setState({showModalSiswa: absen});
  }

  onClickNext = () => {
    this.props.router.push(`/?page=${this.props.page + 1}`,'/');
  }

  onClickClearSiswa = () => {
    this.props.router.push(`/?page=${this.props.page}`,'/');
    this.setState({showModalSiswa: false});
  }

  onClickGaleri = (galeri) => {
    this.props.router.push(`/?page=${this.props.page}&galeri=${galeri}`,'/');
    this.setState({showModalGaleri: galeri});
  }

  onClickClearGaleri = () => {
    this.props.router.push(`/?page=${this.props.page}`,'/');
    this.setState({showModalGaleri: false});
  }

  render() {
    return (
      <>
        <Head>
          <title>Album Fesco</title>
        </Head>
        {this.state.showModalSiswa || this.state.showModalGaleri ?
          <style jsx>{`
            body{
              overflow: hidden;
              -webkit-font-smoothing: antialiased;
            }
          `}</style>
        :
          <style jsx>{`
            body{
              -webkit-font-smoothing: antialiased;
            }
          `}
          </style>
        }
        <header className="mt-5 relative z-10">
          <nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex-shrink-0">
                </div>
                <div className="ml-4 flex items-center md:ml-6">
                  <div className="mr-3 relative">
                    <div className="flex justify-center">
                      <div id="switchTheme" className="flex cursor-pointer items-center">
                        <div className="relative">
                          <div className="togglePath bg-white w-12 h-5 rounded-full shadow-inner" id=""></div>
                          <div className="toggleCircle absolute w-5 h-5 rounded-full shadow inset-y-0 left-0 bg-tranparent text-gray-900 dark:text-white">
                            <svg id="moon" className="h-5 w-5 shadow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                            <svg id="sun" className="h-5 w-5 hidden shadow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <div className="jumbotron text-center pt-24 pb-72">
          <div className="jumbotron-text mt-28 mx-3">
            <p className="mt-2 text-6xl font-extrabold tracking-tight lg:text-9xl md:text-7xl text-white dark:text-gray-200">
            Album <span className="text-indigo-600">Fesco</span>.
            </p>
            <p className="mt-4 max-w-2xl text-base md:text-lg lg:text-xl break-words font-semibold mx-auto text-gray-300">
              SMA NEGRI 1 BINJAI (SMANSA) TAHUN 2023-2024.
            </p>
          </div>
        </div>
        <div className="text-indigo-600 dark:text-indigo-400 mx-auto -mt-16">
          <svg className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 animate-bounce mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        <div className="about mt-60">
          <div className="text-center flex flex-col py-12 px-4 sm:px-6 lg:py-20 lg:px-24 md:text-left md:flex-row md:items-center md:justify-between md:p-12 bg-indigo-50 dark:bg-gray-900">
            <div className="text-2xl md:text-4xl font-semibold md:w-3/4">
              <div className="text-base text-gray-800 dark:text-gray-200 font-medium">Kelas yang penuh kenangan adalah kelas penuh keramaian, kekocakan, kekompakan. Web ini bukan tentang sekolah tapi tentang kelas, semua hal dilakukan akan terkenang didalam memori otak tapi kadang suka lupa karena itu web ini ada. Mungkin web ini bisa nonaktif tetapi akan bisa diaktifkan kembali tanpa ada data hilang.</div>
              <div className="text-indigo-500 mt-3">Tentang Fesco.</div>
            </div>

            <a className="mt-4 md:mt-0 md:ml-2" href="https://www.instagram.com/fesco_32" target="_blank">
              <div className="inline-block font-semibold py-3 px-5 rounded-md text-indigo-400 bg-white hover:bg-indigo-400 hover:text-white dark:bg-gray-800 dark:text-gray-300 shadow-lg dark:hover:bg-indigo-400 dark:hover:text-white">
                <i className="fab fa-instagram mr-1"></i> Instagram
              </div>
            </a>
          </div>
        </div>
        <main className="mt-64 md:mt-70 px-3 lg:px-12">
          <div className="siswa">
            <div className="text-center">
              <p className="mt-2 text-4xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white md:text-5xl dark:text-gray-200">
                Daftar <span className="text-indigo-600">Siswa</span>
              </p>
              <p className="mt-4 max-w-2xl text-base text-gray-500 mx-auto dark:text-gray-400">
                Daftar Siswa Dengan Urut Absen.
              </p>
            </div>
            {this.props.siswa.length != 0 ? (
              <>
                <div className="space-y-10 lg:grid-cols-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-10 mt-14 mx-1">
                  {this.props.siswa.siswas?.map(siswa => {
                    return(
                      <div className="flex" key={siswa.absen}>
                        <div className="py-8 px-8 w-full lg:max-w-sm bg-white rounded-xl shadow-md hover:shadow-xl space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6 dark:bg-indigo-600 ml-0 lg:ml-3 sm:mt-2">
                          <img className="block mx-auto object-cover w-24 h-24 rounded-full sm:mx-0 sm:flex-shrink-0" src={`/img/siswa/${siswa.absen}.jpg`} loading="lazy" />
                          <div className="text-center space-y-2 sm:text-left">
                            <div className="space-y-0.5">
                              <p className="text-lg text-black font-semibold dark:text-gray-200">
                                {siswa.panggilan}
                              </p>
                              <p className="text-gray-500 font-medium dark:text-gray-300">
                                {siswa.nama}
                              </p>
                            </div>
                            <button id="om" className="px-4 py-1 text-sm text-indigo-600 font-semibold rounded-full border border-indigo-400 hover:text-white hover:bg-indigo-600 hover:border-transparent focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:ring-offset-2 dark:text-gray-200 dark:border-white dark:hover:text-gray-200 dark:hover:border-indigo-800 dark:hover:bg-indigo-800 dark:focus:ring-indigo-800 w-full md:w-20" onClick={() => this.onClickSiswa(siswa.absen)}>Detail</button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-20 text-center">
                  <button className="inline-block outline-none focus:outline-none text-base font-semibold py-4 px-7 rounded-md text-white bg-indigo-600 hover:bg-indigo-400 dark:bg-gray-800 dark:text-gray-300 shadow-lg dark:hover:bg-indigo-600 dark:hover:text-white" onClick={this.onClickNext} disabled={this.props.page >= this.props.lastPage}>
                    Selanjutnya <i className="fas fa-chevron-down ml-1"></i>
                  </button>
                </div>
              </>
            ) : <span className="text-center mx-auto text-base md:text-lg font-semibold mt-20">Tidak Ada Data</span>}
            {this.state.showModalSiswa && this.props.modalSiswa ? (
              <>
                {this.props.modalSiswa.siswas?.map(siswa => {
                  return(
                    <>
                      <div className="justify-center items-center overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none mx-5" key={siswa.absen}>
                        <div className="relative w-full my-6 mx-auto max-w-3xl">
                          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none dark:bg-gray-900">
                            <div className="flex items-start justify-between p-5">
                              <button
                                id="cm"
                                className="p-1 ml-auto bg-transparent border-0 text-black dark:text-gray-300 float-right text-4xl leading-none outline-none focus:outline-none"
                                onClick={this.onClickClearSiswa}
                              >
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            <div className="p-6">
                              <img className="block mx-auto object-cover w-40 h-40 shadow-lg rounded-md flex-shrink-0" src={`/img/siswa/${siswa.absen}.jpg`} loading="lazy" />
                              <h2 className="font-semibold text-lg text-center text-black dark:text-white mt-7">{siswa.nama}</h2>
                              <div className="w-full flex-grow my-4 mt-5 text-base leading-relaxed break-words dark:text-gray-300">
                                <div className="flex flex-wrap my-4 md:my-2">
                                  <div className="relative w-full md:w-auto md:mr-2">
                                    Nama Panggilan :
                                  </div>
                                  <div className="w-full md:w-auto flex-grow">
                                    {siswa.panggilan}
                                  </div>
                                </div>
                                <div className="flex flex-wrap my-4 md:my-2">
                                  <div className="relative w-full md:w-auto md:mr-2">
                                    Tempat, Tanggal Lahir :
                                  </div>
                                  <div className="w-full md:w-auto flex-grow">
                                    {siswa.ttl}
                                  </div>
                                </div>
                                <div className="flex flex-wrap my-4 md:my-2">
                                  <div className="relative w-full md:w-auto md:mr-2">
                                    Alamat :
                                  </div>
                                  <div className="w-full md:w-auto flex-grow">
                                    {siswa.alamat}
                                  </div>
                                </div>
                                <div className="flex flex-wrap my-4 md:my-2">
                                  <div className="relative w-full md:w-auto md:mr-2">
                                    Nomer HP :
                                  </div>
                                  <div className="w-full md:w-auto flex-grow">
                                    {siswa.nohp}
                                  </div>
                                </div>
                                <div className="flex flex-wrap my-4 md:my-2">
                                  <div className="relative w-full md:w-auto md:mr-2">
                                    Pesan & Kesan :dittsans ganteng
                                  </div>
                                  <div className="w-full md:w-auto flex-grow">
                                    {siswa.pesan}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center p-6 text-lg mx-auto">
                              {siswa.fb ? (
                                <>
                                  <button className="hover:text-fb text-gray-600 font-bold uppercase px-4 py-2 outline-none focus:outline-none mr-1 mb-1 dark:bg-gray-900 rounded-md hover:shadow-md transition-all transform hover:-translate-y-1 hover:scale-110" type="button" href={`https://facebook.com/${siswa.fb}`} target="_blank">
                                    <i className="fab fa-facebook-f fa-lg"></i>
                                  </button>
                                </>
                              ) : null}
                              {siswa.ig ? (
                                <>
                                  <button className="hover:text-ig text-gray-600 font-bold uppercase px-4 py-2 outline-none focus:outline-none mr-1 mb-1 dark:bg-gray-900 rounded-md hover:shadow-md transition-all transform hover:-translate-y-1 hover:scale-110" type="button" href={`https://www.instagram.com/${siswa.ig}`} target="_blank">
                                    <i className="fab fa-instagram fa-lg"></i>
                                  </button>
                                </>
                              ) : null}
                              {siswa.line ? (
                                <> 
                                  <button className="hover:text-line text-gray-600 font-bold uppercase px-4 py-2 outline-none focus:outline-none mr-1 mb-1 dark:bg-gray-900 rounded-md hover:shadow-md transition-all transform hover:-translate-y-1 hover:scale-110" type="button" href={`https://line.me/ti/p/~${siswa.line}`} target="_blank">
                                    <i className="fab fa-line fa-lg"></i>
                                  </button>
                                </>
                              ) : null}
                              {siswa.telegram ? (
                                <>
                                  <button className="hover:text-telegram text-gray-600 font-bold uppercase px-4 py-2 outline-none focus:outline-none mr-1 mb-1 dark:bg-gray-900 rounded-md hover:shadow-md transition-all transform hover:-translate-y-1 hover:scale-110" type="button" href={`https://t.me/${siswa.telegram}`} target="_blank">
                                    <i className="fab fa-telegram-plane fa-lg"></i>
                                  </button>
                                </>
                              ) : null}
                              {siswa.tiktok ? (
                                <>
                                  <button className="hover:text-tiktok dark:hover:text-white text-gray-600 font-bold uppercase px-4 py-2 outline-none focus:outline-none mr-1 mb-1 dark:bg-gray-900 rounded-md hover:shadow-md transition-all transform hover:-translate-y-1 hover:scale-110" type="button" href={`http://vt.tiktok.com/${siswa.tiktok}`} target="_blank">
                                    <i className="fab fa-tiktok fa-lg"></i>
                                  </button>
                                </>
                              ) : null}
                              {siswa.linkedin ? (
                                <>
                                  <button className="hover:text-linkedin text-gray-600 font-bold uppercase px-4 py-2 outline-none focus:outline-none mr-1 mb-1 dark:bg-gray-900 rounded-md hover:shadow-md transition-all transform hover:-translate-y-1 hover:scale-110" type="button" href={`https://linkedin.com/in/${siswa.linkedin}`} target="_blank">
                                    <i className="fab fa-linkedin-in fa-lg"></i>
                                  </button>
                                </>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="opacity-60 fixed inset-0 z-40 bg-black"></div>
                    </>
                  )
                })}
              </>
            ) : null}
          </div>
          <div className="gallery mt-44">
            <div className="text-center">
              <p className="mt-2 text-4xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white md:text-5xl dark:text-gray-200">
                Galeri
              </p>
              <p className="mt-4 max-w-2xl text-base text-gray-500 mx-auto dark:text-gray-400">
                Foto-Foto Masa Disekolah dan kebersamaan diluar.
              </p>
            </div>
            {this.props.galeri.length != 0 ? 
              <>
                {this.props.galeri.galeris?.map(galeri => {
                  return (
                    <div id="photos" className="my-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-10" key={galeri.id}>
                      <div className="mt-1 md:mt-3 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">
                          <a onClick={() => this.onClickGaleri(galeri.id)}>
                            <img className="w-full h-64 object-contain" src={galeri.gambar.url} alt={galeri.caption} loading="lazy" />
                          </a>
                      </div>
                    </div>
                  )
                })}
              </>
              :
              <span className="text-center mx-auto text-base md:text-lg font-semibold mt-20">Tidak Ada Data</span>
            }
            {this.state.showModalGaleri && this.props.modalGaleri ? (
              <>
                {this.props.modalGaleri.galeris?.map(galeri => {
                  return (
                    <>
                      <div className="justify-center items-center overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none mx-5 my-auto content-center">
                        <div className="relative w-full my-6 mx-auto max-w-3xl">
                          <div className="flex items-start justify-between p-5 border-0 relative flex-col w-full outline-none -mb-2">
                            <button id="cm"
                              className="p-1 ml-auto bg-transparent border-0 text-gray-300 float-right text-4xl md:text-5xl leading-none outline-none focus:outline-none" onClick={this.onClickClearGaleri}>
                              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <img className="w-full h-full object-contain" src={galeri.gambar.url} loading="lazy" />
                          <div className="w-full my-6 mx-auto flex relative items-center text-white font-semibold justify-center">
                            <span>{galeri.caption}</span>
                          </div>
                        </div>
                      </div>
                      <div className="opacity-80 fixed inset-0 z-40 bg-black"></div>
                    </>
                  )
                })}
              </>
            ) : null}
          </div>
        </main>
        <footer className="mt-20 shadow-inner bottom-0 py-3">
          <div className="max-w-7xl mx-auto py-2 px-2 sm:px-6 lg:px-8">
            <p className="text-center dark:text-gray-300 text-sm font-normal truncate mx-auto">
              Made with &copy; by Nizar
            </p>
          </div>
        </footer>
      </>
    )
  }
}

export default withRouter(Home)
