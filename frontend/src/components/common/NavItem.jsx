import React, { Fragment } from 'react';

function NavItem(props) {
	const Icon = props.Icon;
	return (
		<div className="mb-4">
			{props.checked ? (
				<input
					className='nav-radio'
					type='radio'
					name={props.name}
					id={props.id}
					value={props.value}
					defaultChecked
				/>
			) : (
				<input
					className='nav-radio'
					type='radio'
					name={props.name}
					id={props.id}
					value={props.value}
				/>
			)}
			<label className='nav-label' htmlFor={props.id} onClick={props.onClick}>
				{Icon ? <Icon /> : ''}
				<p>{props.label}</p>
			</label>
		</div>
	);
}

export default NavItem;
