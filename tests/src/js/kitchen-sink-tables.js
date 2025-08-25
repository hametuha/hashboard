/*!
 * Kitchen Sink - Tables Tab
 */

const { createRoot, useState, useEffect } = wp.element;
const { Button, SearchControl, SelectControl } = wp.components;

// Table components from hb namespace (available at runtime)
let ListTable, PostList, LoadingIndicator, Pagination;

// Initialize components when available
const initTableComponents = () => {
	if ( window.hb?.components?.listTable ) {
		ListTable = window.hb.components.listTable;
	}
	if ( window.hb?.components?.postList ) {
		PostList = window.hb.components.postList;
	}
	if ( window.hb?.components?.loading ) {
		LoadingIndicator = window.hb.components.loading;
	}
	if ( window.hb?.components?.pagination ) {
		Pagination = window.hb.components.pagination;
	}
};

// Sample data
const generateSamplePosts = ( count = 10 ) => {
	const posts = [];
	const titles = [
		'Getting Started with WordPress',
		'Advanced React Patterns',
		'Understanding JavaScript Closures',
		'CSS Grid Layout Guide',
		'Building REST APIs',
		'Modern PHP Development',
		'Database Optimization Tips',
		'Security Best Practices',
		'Performance Optimization',
		'Accessibility Guidelines',
	];
	
	for ( let i = 1; i <= count; i++ ) {
		posts.push( {
			id: i,
			title: { rendered: titles[ ( i - 1 ) % titles.length ] + ` #${ i }` },
			link: `#post-${ i }`,
			date: new Date( Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000 ).toLocaleDateString(),
			excerpt: { rendered: `This is a sample excerpt for post #${ i }. Lorem ipsum dolor sit amet...` },
			author: { name: `Author ${ Math.ceil( i / 2 ) }` },
			status: Math.random() > 0.8 ? 'draft' : 'publish',
		} );
	}
	
	return posts;
};

const generateSampleUsers = ( count = 8 ) => {
	const users = [];
	const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson', 'Diana Davis', 'Eve Miller', 'Frank Taylor'];
	const roles = ['Administrator', 'Editor', 'Author', 'Contributor'];
	
	for ( let i = 1; i <= count; i++ ) {
		users.push( {
			id: i,
			name: names[ ( i - 1 ) % names.length ],
			email: `user${ i }@example.com`,
			avatar: `https://i.pravatar.cc/40?img=${ i }`,
			role: roles[ Math.floor( Math.random() * roles.length ) ],
			posts_count: Math.floor( Math.random() * 50 ),
		} );
	}
	
	return users;
};

// List Table Test Component
const ListTableTest = () => {
	const [ posts, setPosts ] = useState( generateSamplePosts( 50 ) );
	const [ loading, setLoading ] = useState( false );
	const [ currentPage, setCurrentPage ] = useState( 1 );
	const [ searchQuery, setSearchQuery ] = useState( '' );
	const [ statusFilter, setStatusFilter ] = useState( 'all' );
	
	const itemsPerPage = 10;
	
	// Filter and paginate data
	const filteredPosts = posts.filter( ( post ) => {
		const matchesSearch = post.title.rendered.toLowerCase().includes( searchQuery.toLowerCase() );
		const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
		return matchesSearch && matchesStatus;
	} );
	
	const totalPages = Math.ceil( filteredPosts.length / itemsPerPage );
	const currentItems = filteredPosts.slice( 
		( currentPage - 1 ) * itemsPerPage, 
		currentPage * itemsPerPage 
	);
	
	// Handle page change
	const handlePageChange = ( page ) => {
		setCurrentPage( page );
	};
	
	// Handle search
	const handleSearch = ( query ) => {
		setSearchQuery( query );
		setCurrentPage( 1 );
	};
	
	// Handle status filter
	const handleStatusFilter = ( status ) => {
		setStatusFilter( status );
		setCurrentPage( 1 );
	};
	
	// Simulate loading
	const handleRefresh = () => {
		setLoading( true );
		setTimeout( () => {
			setPosts( generateSamplePosts( 50 ) );
			setLoading( false );
		}, 1000 );
	};
	
	// Custom render functions
	const renderHeader = () => (
		<div className="d-flex justify-content-between align-items-center mb-3">
			<div>
				<h4>Posts ({ filteredPosts.length })</h4>
			</div>
			<div className="d-flex gap-2">
				<SearchControl
					value={ searchQuery }
					onChange={ handleSearch }
					placeholder="Search posts..."
				/>
				<SelectControl
					value={ statusFilter }
					onChange={ handleStatusFilter }
					options={ [
						{ label: 'All Status', value: 'all' },
						{ label: 'Published', value: 'publish' },
						{ label: 'Draft', value: 'draft' },
					] }
				/>
				<Button isSecondary onClick={ handleRefresh }>
					Refresh
				</Button>
			</div>
		</div>
	);
	
	const renderPostItem = ( post ) => (
		<div className="d-flex justify-content-between align-items-center">
			<div className="flex-grow-1">
				<h6 className="mb-1">
					<a href={ post.link }>{ post.title.rendered }</a>
				</h6>
				<small className="text-muted">
					By { post.author?.name || 'Unknown' } • { post.date } • Status: { post.status }
				</small>
			</div>
			<div>
				<Button isSmall isSecondary>
					Edit
				</Button>
			</div>
		</div>
	);
	
	const renderEmpty = () => (
		<div className="text-center py-5">
			<p className="text-muted">No posts found matching your criteria.</p>
			<Button isPrimary onClick={ () => { setSearchQuery( '' ); setStatusFilter( 'all' ); } }>
				Clear Filters
			</Button>
		</div>
	);
	
	if ( ! ListTable ) {
		return <p>ListTable component not available</p>;
	}
	
	return (
		<ListTable
			items={ currentItems }
			loading={ loading }
			curPage={ currentPage }
			totalPage={ totalPages }
			renderHeader={ renderHeader }
			renderItem={ renderPostItem }
			renderEmpty={ renderEmpty }
			onPageChanged={ handlePageChange }
			listClass="list-item p-3 border-bottom"
			listWrapperClass="list-group"
		/>
	);
};

// User List Test Component
const UserListTest = () => {
	const [ users, setUsers ] = useState( generateSampleUsers() );
	const [ currentPage, setCurrentPage ] = useState( 1 );
	
	const itemsPerPage = 5;
	const totalPages = Math.ceil( users.length / itemsPerPage );
	const currentItems = users.slice( 
		( currentPage - 1 ) * itemsPerPage, 
		currentPage * itemsPerPage 
	);
	
	const renderUserItem = ( user ) => (
		<div className="d-flex align-items-center">
			<img 
				src={ user.avatar } 
				alt={ user.name }
				className="rounded-circle me-3"
				width={ 40 }
				height={ 40 }
			/>
			<div className="flex-grow-1">
				<h6 className="mb-0">{ user.name }</h6>
				<small className="text-muted">{ user.email }</small>
			</div>
			<div className="text-end">
				<span className="badge bg-secondary me-2">{ user.role }</span>
				<small className="text-muted">{ user.posts_count } posts</small>
			</div>
		</div>
	);
	
	if ( ! ListTable ) {
		return <p>ListTable component not available</p>;
	}
	
	return (
		<>
			<h4>Users</h4>
			<ListTable
				items={ currentItems }
				curPage={ currentPage }
				totalPage={ totalPages }
				renderItem={ renderUserItem }
				onPageChanged={ setCurrentPage }
				listClass="list-item p-3"
				listWrapperClass="list-group border rounded"
			/>
		</>
	);
};

// PostList Test Component
const PostListTest = () => {
	const [ posts, setPosts ] = useState( generateSamplePosts( 15 ) );
	const [ loading, setLoading ] = useState( false );
	
	const handleRefresh = () => {
		setLoading( true );
		setTimeout( () => {
			setPosts( generateSamplePosts( 15 ) );
			setLoading( false );
		}, 800 );
	};
	
	if ( ! PostList ) {
		// Fallback if PostList is not available
		return <p>PostList component not available, using ListTable instead</p>;
	}
	
	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-3">
				<h4>Recent Posts</h4>
				<Button isSecondary onClick={ handleRefresh } disabled={ loading }>
					{ loading ? 'Loading...' : 'Refresh' }
				</Button>
			</div>
			<PostList
				posts={ posts }
				loading={ loading }
				showExcerpt={ true }
				showAuthor={ true }
				showDate={ true }
			/>
		</>
	);
};

// Mount tables when DOM is ready and components are available
const initTables = () => {
	initTableComponents();
	
	const tablesContainer = document.getElementById( 'tables-container' );
	if ( tablesContainer && ListTable ) {
		createRoot( tablesContainer ).render(
			<>
				<div className="table-section mb-5">
					<h3>List Table with Pagination and Search</h3>
					<ListTableTest />
				</div>

				<div className="table-section mb-5">
					<h3>User List</h3>
					<UserListTest />
				</div>

				<div className="table-section mb-5">
					<h3>Post List Component</h3>
					<PostListTest />
				</div>
			</>
		);
	}
};

// Initialize when DOM is ready
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initTables );
} else {
	initTables();
}