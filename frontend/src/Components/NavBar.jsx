import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";

const Container = styled.div`
	height: 60px;
	background-color: #fffff;
`;
const Wrapper = styled.div`
	padding: 10px 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;
const Left = styled.div`
	flex: 1;
`;
const Center = styled.div`
	flex: 1;
`;
const Right = styled.div`
	flex: 1;
`;
const Logo = styled.h1``;
const Menu = styled.ul``;
const MenuItem = styled.li``;

const NavBar = () => {
	return (
		<>
			<Container>
				<Wrapper>
					<Left>
						<Logo>Logo</Logo>
					</Left>
					<Center>
						<SearchIcon />
					</Center>
					<Right>Right</Right>
				</Wrapper>
			</Container>
		</>
	);
};

export default NavBar;
