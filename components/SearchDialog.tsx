'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCompletion } from 'ai/react'
import { X, Loader, User, Frown, CornerDownLeft, Search, Wand } from 'lucide-react'

const filterState = ["All", "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
const filterLevel = ["All", "Beginner", "Intermediate", "Advanced"];
const filterField = ["All", "Clinical Psychology", "Counseling Psychology", "Marriage and Family Therapy",
                     "Child and Adolescent Therapy", "Geriatric Therapy", "Substance Abuse and Addictions Counseling",
                     "Physical Therapy", "Art Therapy", "Cognitive Behavioral Therapy (CBT)"];
const filterAge = ["All", "20 - 30", "30 - 40", "40 - 50", "50 - 60", "60 - 70"];

export function SearchDialog() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState<string>('')
  
  const [searchDropdownState, setSearchDropdownState] = React.useState<string>("");
  const [searchDropdownLevel, setSearchDropdownLevel] = React.useState<string>("");
  const [searchDropdownField, setSearchDropdownField] = React.useState<string>("");
  const [searchDropdownAge, setSearchDropdownAge] = React.useState<string>("");
  const [selectedFilterState, setSelectedFilterState] = React.useState(filterState[0]);
  const [selectedFilterLevel, setSelectedFilterLevel] = React.useState(filterLevel[0]);
  const [selectedFilterField, setSelectedFilterField] = React.useState(filterField[0]);
  const [selectedFilterAge, setSelectedFilterAge] = React.useState(filterAge[0]);
  const [showDropdownState, setShowDropdownState] = React.useState(false);
  const [showDropdownLevel, setShowDropdownLevel] = React.useState(false);
  const [showDropdownField, setShowDropdownField] = React.useState(false);
  const [showDropdownAge, setShowDropdownAge] = React.useState(false);
  
  // Dropdown State settings
  const toggleDropdownState = () => { 
    setShowDropdownState(!showDropdownState);
    setShowDropdownLevel(false);
    setShowDropdownField(false);
    setShowDropdownAge(false);
  }
  const toggleDropdownLevel = () => { 
    setShowDropdownLevel(!showDropdownLevel); 
    setShowDropdownState(false);
    setShowDropdownField(false);
    setShowDropdownAge(false);
  }
  const toggleDropdownField = () => { 
    setShowDropdownField(!showDropdownField);
    setShowDropdownState(false);
    setShowDropdownLevel(false);
    setShowDropdownAge(false); 
  }
  const toggleDropdownAge = () => { 
    setShowDropdownAge(!showDropdownAge);
    setShowDropdownState(false);
    setShowDropdownLevel(false);
    setShowDropdownField(false);
  }

  const { complete, completion, isLoading, error } = useCompletion({
    api: '/api/vector-search',
  })

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        setOpen(true)
      }

      if (e.key === 'Escape') {
        console.log('esc')
        handleModalToggle()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  function handleModalToggle() {
    setOpen(!open)
    setQuery('')
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    console.log(query)
    complete(query)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-base flex gap-2 items-center px-4 py-2 z-50 relative
        text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300
        transition-colors
        rounded-md
        border border-slate-200 dark:border-slate-500 hover:border-slate-300 dark:hover:border-slate-500
        min-w-[400%]"
      >
        <Search width={15} />
        <span className="border border-l h-5"></span>
        <span className="inline-block ml-4">Search...</span>
        <kbd
          className="absolute right-3 top-2.5
          pointer-events-none inline-flex h-5 select-none items-center gap-1
          rounded border border-slate-100 bg-slate-100 px-1.5
          font-mono text-[10px] font-medium
          text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400
          opacity-100 "
        >
          <span className="text-xs">⌘</span>K
        </kbd>{' '}
      </button>
      <Dialog open={open}>
        <DialogContent className="sm:max-w-[850px] text-black">
          <DialogHeader>
            <DialogTitle>Life Letters Therapist Search</DialogTitle>
            <DialogDescription>
              Search the therapists that best suit your individual preference!
            </DialogDescription>
            <hr />
            <button className="absolute top-0 right-2 p-2" onClick={() => setOpen(false)}>
              <X className="h-4 w-4 dark:text-gray-100" />
            </button>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 text-slate-700">
              {query && (
                <div className="flex gap-4">
                  <span className="bg-slate-100 dark:bg-slate-300 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <User width={18} />{' '}
                  </span>
                  <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-100">{query}</p>
                </div>
              )}

              {isLoading && (
                <div className="animate-spin relative flex w-5 h-5 ml-2">
                  <Loader />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-4">
                  <span className="bg-red-100 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <Frown width={18} />
                  </span>
                  <span className="text-slate-700 dark:text-slate-100">
                    Sad news, the search has failed! Please try again.
                  </span>
                </div>
              )}

              {completion && !error ? (
                <div className="flex items-center gap-4 dark:text-white">
                  <span className="bg-green-500 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <Wand width={18} className="text-white" />
                  </span>
                  <h3 className="font-semibold">Answer:</h3>
                  {completion}
                </div>
              ) : null}

              <div className="relative">
                <Input
                  placeholder="Search a therapist..."
                  name="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="col-span-3"
                />
                <CornerDownLeft
                  className={`absolute top-3 right-5 h-4 w-4 text-gray-300 transition-opacity ${
                    query ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-100">
                Or try:{' '}
                <button
                  type="button"
                  className="px-1.5 py-0.5
                  bg-slate-50 dark:bg-gray-500
                  hover:bg-slate-100 dark:hover:bg-gray-600
                  rounded border border-slate-200 dark:border-slate-600
                  transition-colors"
                  onClick={(_) => setQuery('What are embeddings?')}
                >
                  Example Search
                </button>
              </div>
            </div>
            
            {/* Filters */}
            <div>
              <div className="flex text-left" style={{gap: '1rem'}}>

                {/* State Filter */}
                <div>
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                    id="options-menu"
                    aria-haspopup="true"
                    aria-expanded="true"
                    onClick={toggleDropdownState}
                  >
                    {selectedFilterState}
                    <svg
                      className="-mr-1 ml-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                      <path fill="none" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" />
                    </svg>
                  </button>
                </div>
                {showDropdownState && (
                  <div
                    className={`origin-top-right mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-opacity`} 
                  >
                    <input 
                      type="text" 
                      value={searchDropdownState} 
                      onChange={e => setSearchDropdownState(e.target.value)} 
                      className="block w-full px-4 py-2 mb-2 text-sm text-gray-700 border border-gray-300 rounded-md" 
                      placeholder="Search State"
                    />
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu" 
                        style={{maxHeight: '20rem', overflowY: 'auto'}}
                    >
                      {filterState.filter(filter => filter.toLowerCase().includes(searchDropdownState.toLowerCase())).map((filter) => (
                        <button
                          key={filter}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                          onClick={() => {
                            setSelectedFilterState(filter);
                            toggleDropdownState();
                          }}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Level Filter */}
                <div>
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                    id="options-menu"
                    aria-haspopup="true"
                    aria-expanded="true"
                    onClick={toggleDropdownLevel}
                  >
                    {selectedFilterLevel}
                    <svg
                      className="-mr-1 ml-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                      <path fill="none" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" />
                    </svg>
                  </button>
                </div>
                {showDropdownLevel && (
                  <div
                    className={`origin-top-right mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-opacity`}
                  >
                    <input 
                      type="text" 
                      value={searchDropdownLevel} 
                      onChange={e => setSearchDropdownLevel(e.target.value)} 
                      className="block w-full px-4 py-2 mb-2 text-sm text-gray-700 border border-gray-300 rounded-md" 
                      placeholder="Search Level"
                    />
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu" 
                        style={{maxHeight: '20rem', overflowY: 'auto'}}
                    >
                      {filterLevel.filter(filter => filter.toLowerCase().includes(searchDropdownLevel.toLowerCase())).map((filter) => (
                        <button
                          key={filter}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                          onClick={() => {
                            setSelectedFilterLevel(filter);
                            toggleDropdownLevel();
                          }}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Field Filter */}
                <div>
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                    id="options-menu"
                    aria-haspopup="true"
                    aria-expanded="true"
                    onClick={toggleDropdownField}
                  >
                    {selectedFilterField}
                    <svg
                      className="-mr-1 ml-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                      <path fill="none" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" />
                    </svg>
                  </button>
                </div>
                {showDropdownField && (
                  <div
                    className={`origin-top-right mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-opacity`}
                  >
                    <input 
                      type="text" 
                      value={searchDropdownField} 
                      onChange={e => setSearchDropdownField(e.target.value)} 
                      className="block w-full px-4 py-2 mb-2 text-sm text-gray-700 border border-gray-300 rounded-md" 
                      placeholder="Search Field"
                    />
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu" 
                        style={{maxHeight: '20rem', overflowY: 'auto'}}
                    >
                      {filterField.filter(filter => filter.toLowerCase().includes(searchDropdownField.toLowerCase())).map((filter) => (
                        <button
                          key={filter}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          style={{ textAlign: 'left' }}
                          role="menuitem"
                          onClick={() => {
                            setSelectedFilterField(filter);
                            toggleDropdownField();
                          }}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Age Filter */}
                <div>
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                    id="options-menu"
                    aria-haspopup="true"
                    aria-expanded="true"
                    onClick={toggleDropdownAge}
                  >
                    {selectedFilterAge}
                    <svg
                      className="-mr-1 ml-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                      <path fill="none" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" />
                    </svg>
                  </button>
                </div>
                {showDropdownAge && (
                  <div
                    className={`origin-top-right mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-opacity`}
                    style={{marginTop: '3rem', maxHeight: '20rem', overflowY: 'auto'}}
                  >
                    <input 
                      type="text" 
                      value={searchDropdownAge} 
                      onChange={e => setSearchDropdownAge(e.target.value)} 
                      className="block w-full px-4 py-2 mb-2 text-sm text-gray-700 border border-gray-300 rounded-md" 
                      placeholder="Search Age"
                    />
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu" 
                        style={{maxHeight: '20rem', overflowY: 'auto'}}
                    >
                      {filterAge.filter(filter => filter.toLowerCase().includes(searchDropdownAge.toLowerCase())).map((filter) => (
                        <button
                          key={filter}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                          onClick={() => {
                            setSelectedFilterAge(filter);
                            toggleDropdownAge();
                          }}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" className="bg-red-500">
                Search
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
