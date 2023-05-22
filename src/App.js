import './App.css';
import { useRef, useState } from 'react';
import axios from "axios";
import Card from './card';
import { useEffect } from 'react';
import loader from "./utils/Spinner-1s-200px.gif";
import seachIcon from "./utils/icons8-search.svg";
import filterIcon from "./utils/empty-filter-32.png";

function App() {
  const [searchString, setSearchstring] = useState();
  const [isAscending, setisAscending] = useState(null);
  const [tempRepo , setTemprepo] = useState([]);
  const [filter,setFilter] = useState(null);
  const [showPouup, setshowPouup] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState();
  const [repo, setRepo] = useState([]);
  const [pagination, setPagination] = useState(2);
  const [stoppagination, setStoppagination] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const inputRef = useRef(null);

  // infinite scroll
  useEffect(() => {
    function handleScroll() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

      if (scrollHeight - scrollTop - clientHeight < 250 && !showLoader && !stoppagination) {
        console.log(showLoader)
        getpaginationData();
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showLoader, pagination, repo, stoppagination]);

  useEffect(()=>{
    if(!tempRepo.length){
      console.log("copying repo");
      setTemprepo([...repo]);
    }
  },[filter]);

  function searchhandler(event, is_pagination) {
    setisAscending(null);
    setFilter(null);
    // setRepo([...tempRepo]);
    setTemprepo([]);
    setSearchstring(event.target.value);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    if (!event.target.value) {
      setRepo([]);
      return;
    }

    setSearchTimeout(setTimeout(() => {
      console.log(event.target.value);
      setShowLoader(true);
      axios.get('https://api.github.com/search/repositories', {
        params: {
          q: event.target.value,
          per_page: 20,
          page: 1
        },
      })
        .then(res => {
          setShowLoader(false);
          console.log(res);
          if (is_pagination) {
            setStoppagination(res.data.incomplete_results);
            setRepo(prev => {
              return [...prev, ...res.data.items];
            })
          } else {
            setRepo([]);
            setRepo(prev => {
              return [...prev, ...res.data.items];
            });
            console.log(pagination)
            // setPagination(prev => prev+1);
          }
        })
        .catch(error => {
          console.log(error);
          alert(error);
          setShowLoader(false);
        });
    }, 500));
  }

  function getpaginationData() {
    console.log(pagination);
    setisAscending(null);
    setFilter(null);
    if(tempRepo.length){
      setRepo([...tempRepo]);
      setTemprepo([]);
    }
    setPagination(prev => prev + 1);
    setShowLoader(true);
    // return;
    axios.get('https://api.github.com/search/repositories', {
      params: {
        q: inputRef.current.value,
        per_page: 20,
        page: pagination
      },
    })
      .then(res => {
        console.log(res);
        setStoppagination(res.data.incomplete_results);
        setRepo(prev => {
          return [...prev, ...res.data.items];
        });
        setShowLoader(false);
      })
      .catch(error => {
        console.log(error);
        alert(error);
      });
  }
  function applyFilter(){
    // console.log(option)
    if(!filter){
      alert('please select a filter');
      return;
    }
    if(isAscending == null){
      alert('Please select order');
      return;
    }
    
    const comparison = isAscending ? 1 : -1;
    let sortedData;
    switch (filter) {
      case 'created_at':
      case 'updated_at':
          sortedData = repo.sort((a, b) => {
          const dateA = new Date(a[filter]).getTime();
          const dateB = new Date(b[filter]).getTime();
        
          if (dateA < dateB) {
            return isAscending ? -1 : 1;
          } else if (dateA > dateB) {
            return isAscending ? 1 : -1;
          } else {
            return 0;
          }
        });
        break;
      case 'name':
          sortedData = repo.sort((a, b) => {
          const valueA = a[filter];
          const valueB = b[filter];
        
          if (valueA < valueB) {
            return isAscending ? -1 : 1;
          } else if (valueA > valueB) {
            return isAscending ? 1 : -1;
          } else {
            return 0;
          }
        });
        break;
      case 'score':
      case 'stargazers_count':
      case 'watchers_count':
        sortedData = repo.sort((a, b) => (a[filter] - b[filter])*comparison);
        break;
    }

    setRepo(sortedData);
    setshowPouup(false);

    console.log('::repo::',repo);
    console.log('::Temprepo::',tempRepo);
  }
  function clearFilter(){
    if(!filter || isAscending == null){
    setshowPouup(false);
      return;
    }
    setRepo([...tempRepo]);
    setTemprepo([]);
    setisAscending(null);
    setFilter(null);
    setshowPouup(false);
  }
  return (
    <div className="App">
      <h1 className='header'>GitHub</h1>
      <div className='search'>
        <div className='searchDiv'><input type='text' placeholder='search repositories' onChange={searchhandler} ref={inputRef} />
          <img className='searchicon' src={seachIcon} alt="search--v1" />
          {repo.length > 0 && <img onClick={()=>setshowPouup(true)} className='filterIcons' width="32" height="32" src={filterIcon} alt="filter"/>}
        </div>
      </div>

      <div className='cardSection'>
        {repo.length > 0 && repo.map(ele => {
          return <Card key={ele.id} avatar={ele.owner.avatar_url} repo={ele.name} star={ele.stargazers_count} description={ele.description} language={ele.language} />
        })}
      </div>

      {showLoader && <div style={{ textAlign: 'center' }}>
        <img className='loader' height="25px" width="25px" src={loader} alt="spinner" />
      </div>}

      {showPouup && <div className='overLay'>
        <div className='content'>
          <div className='popupheader'>
            <h1 style={{ color: 'black' }}>Filter</h1>
            <img className='crossIcon' width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/multiply.png" alt="multiply" onClick={()=> setshowPouup(false)}/>
          </div>
          <ul>
            <li onClick={()=> setFilter('stargazers_count')} className={`${filter=='stargazers_count'?'Active':''}`}>STARS</li>
            <li onClick={()=> setFilter('watchers_count')} className={`${filter=='watchers_count'?'Active':''}`}>watchers count</li>
            <li onClick={()=> setFilter('score')} className={`${filter=='score'?'Active':''}`}>score</li>
            <li onClick={()=> setFilter('name')} className={`${filter=='name'?'Active':''}`}>name</li>
            <li onClick={()=> setFilter('created_at')} className={`${filter=='created_at'?'Active':''}`}>created at</li>
            <li onClick={()=> setFilter('updated_at')} className={`${filter=='updated_at'?'Active':''}`}>updatedat</li>
          </ul>
          <hr />
          <ul>
            <li onClick={()=> setisAscending(1)} className={`${isAscending == 1?'Active':''}`}>
              ascending
            </li>
            <li onClick={()=> setisAscending(0)} className={`${isAscending == 0?'Active':''}`}>
              descending
            </li>
          </ul>
          <div className='filterbtnDiv'>
          <span onClick={applyFilter}>Apply</span><span onClick={clearFilter}>Clear</span>
          </div>
        </div>
      </div>}
    </div>
  );
}

export default App;
