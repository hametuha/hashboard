/*!
 * Kitchen Sink - Bootstrap Tab
 */

const { createRoot, useState } = wp.element;
const { Button } = wp.components;
const { toast } = window.hb?.plugins || {};

// Bootstrap Components Test
const BootstrapTest = () => {
	const [ alertVisible, setAlertVisible ] = useState( true );
	const [ modalVisible, setModalVisible ] = useState( false );
	const [ accordionOpen, setAccordionOpen ] = useState( null );
	
	const showToast = ( type ) => {
		if ( toast ) {
			toast( `This is a ${ type } toast message!`, {
				type,
				duration: 3000,
			} );
		}
	};
	
	const toggleAccordion = ( index ) => {
		setAccordionOpen( accordionOpen === index ? null : index );
	};
	
	return (
		<div className="bootstrap-test-container">
			{/* Alerts */}
			<section className="mb-4">
				<h3>Alerts</h3>
				{ alertVisible && (
					<div className="alert alert-warning alert-dismissible" role="alert">
						<strong>Holy guacamole!</strong> You should check in on some of those fields below.
						<button 
							type="button" 
							className="btn-close" 
							onClick={ () => setAlertVisible( false ) }
							aria-label="Close"
						></button>
					</div>
				) }
				<div className="alert alert-primary" role="alert">
					A simple primary alert—check it out!
				</div>
				<div className="alert alert-success" role="alert">
					A simple success alert—check it out!
				</div>
				<div className="alert alert-danger" role="alert">
					A simple danger alert—check it out!
				</div>
			</section>
			
			{/* Buttons */}
			<section className="mb-4">
				<h3>Buttons</h3>
				<div className="mb-3">
					<button type="button" className="btn btn-primary me-2">Primary</button>
					<button type="button" className="btn btn-secondary me-2">Secondary</button>
					<button type="button" className="btn btn-success me-2">Success</button>
					<button type="button" className="btn btn-danger me-2">Danger</button>
					<button type="button" className="btn btn-warning me-2">Warning</button>
					<button type="button" className="btn btn-info me-2">Info</button>
					<button type="button" className="btn btn-light me-2">Light</button>
					<button type="button" className="btn btn-dark">Dark</button>
				</div>
				<div className="mb-3">
					<button type="button" className="btn btn-outline-primary me-2">Primary</button>
					<button type="button" className="btn btn-outline-secondary me-2">Secondary</button>
					<button type="button" className="btn btn-outline-success">Success</button>
				</div>
			</section>
			
			{/* Cards */}
			<section className="mb-4">
				<h3>Cards</h3>
				<div className="row">
					<div className="col-md-6">
						<div className="card">
							<div className="card-header">
								Featured
							</div>
							<div className="card-body">
								<h5 className="card-title">Special title treatment</h5>
								<p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
								<a href="#" className="btn btn-primary">Go somewhere</a>
							</div>
						</div>
					</div>
					<div className="col-md-6">
						<div className="card">
							<div className="card-body">
								<h5 className="card-title">Card title</h5>
								<h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
								<p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
								<a href="#" className="card-link">Card link</a>
								<a href="#" className="card-link">Another link</a>
							</div>
						</div>
					</div>
				</div>
			</section>
			
			{/* Forms */}
			<section className="mb-4">
				<h3>Forms</h3>
				<form>
					<div className="mb-3">
						<label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
						<input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
					</div>
					<div className="mb-3">
						<label htmlFor="exampleFormControlTextarea1" className="form-label">Example textarea</label>
						<textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
					</div>
					<div className="mb-3">
						<label htmlFor="exampleFormControlSelect1" className="form-label">Example select</label>
						<select className="form-select" id="exampleFormControlSelect1">
							<option>1</option>
							<option>2</option>
							<option>3</option>
							<option>4</option>
							<option>5</option>
						</select>
					</div>
					<div className="mb-3 form-check">
						<input type="checkbox" className="form-check-input" id="exampleCheck1" />
						<label className="form-check-label" htmlFor="exampleCheck1">
							Check me out
						</label>
					</div>
					<button type="submit" className="btn btn-primary">Submit</button>
				</form>
			</section>
			
			{/* Toast Integration */}
			<section className="mb-4">
				<h3>Toast Integration</h3>
				<div className="mb-3">
					<button className="btn btn-success me-2" onClick={ () => showToast( 'success' ) }>
						Success Toast
					</button>
					<button className="btn btn-danger me-2" onClick={ () => showToast( 'error' ) }>
						Error Toast
					</button>
					<button className="btn btn-warning me-2" onClick={ () => showToast( 'warning' ) }>
						Warning Toast
					</button>
					<button className="btn btn-info" onClick={ () => showToast( 'info' ) }>
						Info Toast
					</button>
				</div>
			</section>
			
			{/* Modal */}
			<section className="mb-4">
				<h3>Modal</h3>
				<button type="button" className="btn btn-primary" onClick={ () => setModalVisible( true ) }>
					Launch demo modal
				</button>
				
				{ modalVisible && (
					<>
						<div className="modal show d-block" tabIndex="-1">
							<div className="modal-dialog">
								<div className="modal-content">
									<div className="modal-header">
										<h5 className="modal-title">Modal title</h5>
										<button 
											type="button" 
											className="btn-close" 
											onClick={ () => setModalVisible( false ) }
											aria-label="Close"
										></button>
									</div>
									<div className="modal-body">
										<p>Modal body text goes here.</p>
									</div>
									<div className="modal-footer">
										<button type="button" className="btn btn-secondary" onClick={ () => setModalVisible( false ) }>
											Close
										</button>
										<button type="button" className="btn btn-primary">
											Save changes
										</button>
									</div>
								</div>
							</div>
						</div>
						<div className="modal-backdrop show"></div>
					</>
				) }
			</section>
			
			{/* Accordion */}
			<section className="mb-4">
				<h3>Accordion</h3>
				<div className="accordion" id="accordionExample">
					{ [1, 2, 3].map( ( index ) => (
						<div className="accordion-item" key={ index }>
							<h2 className="accordion-header" id={ `heading${ index }` }>
								<button 
									className={ `accordion-button ${ accordionOpen !== index ? 'collapsed' : '' }` }
									type="button"
									onClick={ () => toggleAccordion( index ) }
									aria-expanded={ accordionOpen === index }
									aria-controls={ `collapse${ index }` }
								>
									Accordion Item #{ index }
								</button>
							</h2>
							<div 
								id={ `collapse${ index }` }
								className={ `accordion-collapse collapse ${ accordionOpen === index ? 'show' : '' }` }
								aria-labelledby={ `heading${ index }` }
							>
								<div className="accordion-body">
									<strong>This is the { index } item's accordion body.</strong> It is shown by default, 
									until the collapse plugin adds the appropriate classes that we use to style each element.
								</div>
							</div>
						</div>
					) ) }
				</div>
			</section>
			
			{/* Progress Bars */}
			<section className="mb-4">
				<h3>Progress</h3>
				<div className="progress mb-3">
					<div className="progress-bar" role="progressbar" style={ { width: '25%' } } aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
				</div>
				<div className="progress mb-3">
					<div className="progress-bar bg-success" role="progressbar" style={ { width: '50%' } } aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
				</div>
				<div className="progress mb-3">
					<div className="progress-bar bg-danger" role="progressbar" style={ { width: '75%' } } aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
				</div>
			</section>
		</div>
	);
};

// Mount bootstrap components
const bootstrapContainer = document.getElementById( 'bootstrap-container' );
if ( bootstrapContainer ) {
	createRoot( bootstrapContainer ).render( <BootstrapTest /> );
}